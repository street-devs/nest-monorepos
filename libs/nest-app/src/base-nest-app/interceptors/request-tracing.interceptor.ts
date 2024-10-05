import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { IncomingMessage } from 'http'
import { finalize, Observable } from 'rxjs'
import { LoggerService } from '../services'
import { nowInS } from '@lib/common'
import { type GqlContextType, GqlExecutionContext } from '@nestjs/graphql'

declare module 'http' {
  interface IncomingMessage {
    body: unknown
    params: Record<string, unknown>
  }
}

interface RequestTracingData {
  method?: string
  url?: string
  requestBody?: unknown
  requestParams?: unknown
}

@Injectable()
export class RequestTracingInterceptor implements NestInterceptor {
  public constructor(private readonly _logger: LoggerService) {
    this._logger.setContext(RequestTracingInterceptor.name)
  }

  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    const requestType = context.getType<GqlContextType>()

    const { method, url, requestBody, requestParams, ...rest } =
      requestType === 'graphql'
        ? handleGraphqlRequestTracing(context)
        : handleHttpRequestTracing(context)

    const s1 = nowInS()

    this._logger.info(`[START] ${method} - ${url}`)

    return next.handle().pipe(
      finalize(() => {
        this._logger.info(
          {
            tookMs: nowInS() - s1,
            requestParams,
            requestBody,
            ...rest,
          },
          `[FINISH] ${method} - ${url}`
        )
      })
    )
  }
}

function handleHttpRequestTracing(
  context: ExecutionContext
): RequestTracingData {
  const req: IncomingMessage = context.switchToHttp().getRequest()

  const body = req.body

  const contentType = req.headers['content-type']
  const isMultipart = contentType?.includes('multipart')

  return {
    method: req.method,
    url: req.url,
    requestBody: isMultipart ? 'multipart' : body,
    requestParams: req.params,
  }
}

function handleGraphqlRequestTracing(
  context: ExecutionContext
): RequestTracingData {
  const ctx = GqlExecutionContext.create(context)

  return {
    method: 'POST',
    url: 'graphql',
    requestBody: ctx.getArgByIndex(2)?.body,
    requestParams: null,
  }
}
