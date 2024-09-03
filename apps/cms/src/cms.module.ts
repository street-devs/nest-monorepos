import { Module } from '@nestjs/common'
import { CmsController } from './cms.controller'
import { CmsService } from './cms.service'
import { MonitoringModule } from '@lib/monitoring'
import { ExceptionsModule } from '@lib/nest-app'

@Module({
  imports: [
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
