import { Module } from '@nestjs/common'
import { BaseNestAppModule, ExceptionsModule } from '@lib/nest-app'
import { MonitoringModule } from '@lib/monitoring'
import { CmsController } from './cms.controller'
import { CmsService } from './cms.service'

@Module({
  imports: [
    BaseNestAppModule,
    MonitoringModule.forRoot({
      requestTracing: true,
      autoLoggingRequestResult: false,
    }),
    ExceptionsModule,
  ],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}
