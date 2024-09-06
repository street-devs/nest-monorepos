import { Global, Module, Scope } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ApiRenderInterceptor } from './interceptors'
import { GlobalApplication } from './global-application'

@Global()
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
    GlobalApplication,
  ],
  exports: [GlobalApplication],
})
export class BaseNestAppModule {}
