import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common'
import { map, type Observable } from 'rxjs'

export interface IApiRenderInterceptorOptions {
  showResponseStatus: boolean
}

export class ApiRenderInterceptor implements NestInterceptor {
  public constructor(private readonly _options: IApiRenderInterceptorOptions) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Record<string, unknown>> {
    return next.handle().pipe(
      map((response) => {
        if (context.getType() !== 'http') {
          return response
        }

        if (response === undefined || !response) {
          return {
            status: 'OK',
          }
        }

        if (!this._options.showResponseStatus) {
          return response
        }

        if (isNotObjectResponse(response)) {
          return {
            data: response,
            status: 'OK',
          }
        }

        return {
          ...response,
          status: 'OK',
        }
      })
    )
  }
}

function isNotObjectResponse(response: unknown) {
  return !(response instanceof Object) || Array.isArray(response)
}
