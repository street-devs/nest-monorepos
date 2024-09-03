import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Effect } from 'effect'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ApiRenderInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    return next.handle().pipe(
      map((a) => {
        if (a?._tag) {
          return handleEffectTS(a)
        }

        return a
      })
    )
  }
}

async function handleEffectTS(a: Effect.Effect<unknown>) {
  return Effect.runPromise(a)
}
