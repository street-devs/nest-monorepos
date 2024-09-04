import { Module } from '@nestjs/common'
import { MonitoringModule } from '@lib/monitoring'
import { ExceptionsModule } from '@lib/nest-app'
import { CmsController } from './cms.controller'
import { CmsService } from './cms.service'

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
