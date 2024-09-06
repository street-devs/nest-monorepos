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
import { BaseException, Nullable } from '@lib/common'
import {
  EXCEPTION_CATCHING_OPTIONS,
  IExceptionCatchingOptions,
} from './exceptions.module'
import { logException } from './log-exception'

export interface IExceptionResponse {
  status: string
  statusCode: HttpStatus
  timestamp: Date
  path?: Nullable<string>
  help?: Nullable<string>
  message: string
  data?: Nullable<unknown>
  shouldShowSuccessStatusCode: boolean
}

export interface IUnwantedError extends Error {
  getResponse?: () => string | object
  getStatus?: () => number
}

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter, OnModuleInit {
  private _options: IExceptionCatchingOptions = {}

  public constructor(private readonly _moduleRef: ModuleRef) {}

  public onModuleInit(): void {
    this._options = this._moduleRef.get(EXCEPTION_CATCHING_OPTIONS, {
      strict: false,
    })
  }

  public async catch(
    exception: HttpException | BaseException | IUnwantedError,
    host: ArgumentsHost
  ): Promise<void> {
    const context = host.switchToHttp()

    const request = context.getRequest()

    if (this._options.beforeTransformException) {
      void this._options
        .beforeTransformException(request, exception)
        .catch((e) => {
          logException(e, 'GlobalExceptionFilter.beforeTransformException')
        })
    }

    const { shouldShowSuccessStatusCode, ...exceptionResponse } =
      await this.transformException(request, exception)

    if (this._options.afterTransformException) {
      void this._options
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

    const defaultShouldShowSuccessStatusCode =
      this._options.shouldShowSuccessStatusCode ?? false

    const exceptionResponse: IExceptionResponse = {
      timestamp: new Date(),
      path: request?.url,
      help: undefined,
      message: exceptionMessage,
      data: undefined,
      statusCode: HttpStatus.BAD_REQUEST,
      status: 'FAIL',
      shouldShowSuccessStatusCode: defaultShouldShowSuccessStatusCode,
    }

    if (exception instanceof BaseException) {
      exceptionResponse.help = exception.help
      exceptionResponse.message = exception.message
      exceptionResponse.data = exception.data || undefined

      exceptionResponse.statusCode =
        exception.code || exceptionResponse.statusCode

      exceptionResponse.shouldShowSuccessStatusCode =
        exception.shouldShowSuccessStatusCode ??
        defaultShouldShowSuccessStatusCode

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

      return exceptionResponse
    }

    if (
      exceptionResponse.statusCode === HttpStatus.NOT_FOUND ||
      exception instanceof NotFoundException
    ) {
      exceptionResponse.message = exception.message || 'NOT_FOUND'

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

      exceptionResponse.shouldShowSuccessStatusCode = false
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
