import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { BaseException } from '@lib/common'
import {
  EXCEPTION_CATCHING_CALLBACKS,
  IExceptionCatchingCallbacks,
} from './exceptions.module'
import { logException } from './log-exception'

export interface IGlobalExceptionFilterOptions {
  appType: 'http' | 'graphql'
}

export interface IExceptionResponse {
  status: string
  statusCode: number
  timestamp: Date
  path: string
  help?: string
  message: string
  data?: any
  shouldShowSuccessStatusCode: boolean
}

export interface IUnwantedError extends Error {
  getResponse?: () => string | object
  getStatus?: () => number
}

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter, OnModuleInit {
  private _callbacks: IExceptionCatchingCallbacks = {}

  public constructor(private readonly _moduleRef: ModuleRef) {}

  public onModuleInit(): void {
    this._callbacks = this._moduleRef.get(EXCEPTION_CATCHING_CALLBACKS, {
      strict: false,
    })
  }

  public async catch(
    exception: HttpException | BaseException | IUnwantedError,
    host: ArgumentsHost
  ): Promise<void> {
    const context = host.switchToHttp()

    const request = context.getRequest()

    if (this._callbacks.beforeTransformException) {
      void this._callbacks
        .beforeTransformException(request, exception)
        .catch((e) => {
          logException(e, 'GlobalExceptionFilter.beforeTransformException')
        })
    }

    const { shouldShowSuccessStatusCode, ...exceptionResponse } =
      await this.transformException(request, exception)

    if (this._callbacks.afterTransformException) {
      void this._callbacks
        .afterTransformException(request, exceptionResponse, exception)
        .catch((e) => {
          logException(e, 'GlobalExceptionFilter.afterTransformException')
        })
    }

    const response = context.getResponse()

    if (response.send) {
      return await response
        .status(
          shouldShowSuccessStatusCode
            ? HttpStatus.OK
            : exceptionResponse.statusCode
        )
        .send(exceptionResponse)
    }

    return await response
      .status(
        shouldShowSuccessStatusCode
          ? HttpStatus.OK
          : exceptionResponse.statusCode
      )
      .json(exceptionResponse)
  }

  protected async transformException(
    request: any,
    exception: HttpException | BaseException | IUnwantedError
  ): Promise<IExceptionResponse> {
    let exceptionMessage = 'DEFAULT_EXCEPTION_MESSAGE'

    const exceptionResponse: IExceptionResponse = {
      timestamp: new Date(),
      path: request?.url || undefined,
      help: undefined,
      message: exceptionMessage,
      data: undefined,
      statusCode: HttpStatus.BAD_REQUEST,
      status: 'FAIL',
      shouldShowSuccessStatusCode: false,
    }

    if (exception instanceof BaseException) {
      exceptionResponse.help = exception.help
      exceptionResponse.message = exception.message
      exceptionResponse.data = exception.data || undefined

      exceptionResponse.statusCode =
        exception.code || exceptionResponse.statusCode

      exceptionResponse.shouldShowSuccessStatusCode =
        exception.shouldShowSuccessStatusCode!

      return exceptionResponse
    }

    if (exception instanceof HttpException || exception.getResponse) {
      const response = exception.getResponse ? exception.getResponse() : {}

      const responseMessage =
        typeof response === 'string'
          ? response
          : (response as { message: string }).message

      exceptionMessage = responseMessage || exceptionMessage

      exceptionResponse.statusCode = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST
    }

    if (
      exceptionResponse.statusCode === HttpStatus.UNAUTHORIZED ||
      exceptionResponse.statusCode === HttpStatus.FORBIDDEN ||
      exception instanceof ForbiddenException ||
      exception instanceof UnauthorizedException ||
      exception instanceof BadRequestException
    ) {
      switch (exceptionResponse.statusCode) {
        case HttpStatus.UNAUTHORIZED:
          exceptionResponse.message = 'UNAUTHORIZED'
          break
        case HttpStatus.FORBIDDEN:
          exceptionResponse.message = 'FORBIDDEN'
          exceptionResponse.help = exception.message
          break
        default:
          exceptionResponse.message = exceptionMessage
          break
      }

      exceptionResponse.shouldShowSuccessStatusCode = true

      return exceptionResponse
    }

    if (
      exceptionResponse.statusCode === HttpStatus.NOT_FOUND ||
      exception instanceof NotFoundException
    ) {
      exceptionResponse.message = exception.message || 'NOT_FOUND_EXCEPTION'

      exceptionResponse.shouldShowSuccessStatusCode = true

      return exceptionResponse
    }

    if (
      exception &&
      exception.message &&
      exception.stack &&
      !(exception instanceof HttpException)
    ) {
      exceptionResponse.message =
        catchSpecialException(exception) || exceptionResponse.message

      exceptionResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    }

    logException(exception, 'GlobalExceptionFilter.transformException')

    return exceptionResponse
  }
}

function catchSpecialException(exception: Error): string | undefined {
  if ((exception.message || '').startsWith('Unsupported Media Type')) {
    return 'UNSUPPORTED_MEDIA_TYPE'
  }
}
