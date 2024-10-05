import { Module } from '@nestjs/common'
import { BaseNestAppModule, ExceptionsModule } from '@lib/nest-app'
import { CmsController } from './cms.controller'
import { CmsService } from './cms.service'

@Module({
  imports: [
    BaseNestAppModule.forRoot({
      autoLoggingRequestResult: false,
      requestTracing: false,
      transformReponse: true,
    }),
    ExceptionsModule.forRootAsync({}),
  ],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}
