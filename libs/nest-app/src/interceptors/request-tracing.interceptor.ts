import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { IncomingMessage } from 'http'
import { finalize, Observable } from 'rxjs'
import { LoggerService } from '../services'

declare module 'http' {
  interface IncomingMessage {
    body: unknown
    params: Record<string, unknown>
  }
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
    const req: IncomingMessage = context.switchToHttp().getRequest()

    const s1 = new Date().getTime()

    this._logger.info(`[START] ${req?.method} - ${req?.url}`)

    const body = req.body
    const params = req.params

    const contentType = req.headers['content-type']
    const isMultipart = contentType?.includes('multipart')

    return next.handle().pipe(
      finalize(() => {
        this._logger.info(
          {
            tookMs: new Date().getTime() - s1,
            requestParams: params,
            requestBody: isMultipart ? 'multipart' : body,
          },
          `[FINISH] ${req?.method} - ${req?.url}`
        )
      })
    )
  }
}
