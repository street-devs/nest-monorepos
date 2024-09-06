import { Module } from '@nestjs/common'
import { BaseNestAppModule, ExceptionsModule } from '@lib/nest-app'
import { CmsController } from './cms.controller'
import { CmsService } from './cms.service'

@Module({
  imports: [
    BaseNestAppModule.forRoot({
      requestTracing: true,
      autoLoggingRequestResult: false,
    }),
    ExceptionsModule.forRootAsync({}),
  ],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}
