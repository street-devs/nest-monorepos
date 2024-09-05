import { Module, Scope } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ApiRenderInterceptor } from './interceptors'

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new ApiRenderInterceptor({
          showResponseStatus: true,
        }),
      scope: Scope.REQUEST,
    },
  ],
})
export class BaseNestAppModule {}
