import { Module } from '@nestjs/common'
import { BaseNestAppModule, ExceptionsModule } from '@lib/nest-app'
import { CmsController } from './cms.controller'
import { CmsService } from './cms.service'
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data'

@Module({
  imports: [
    BaseNestAppModule.forRoot({
      autoLoggingRequestResult: false,
      requestTracing: false,
      transformReponse: true,
    }),
    ExceptionsModule.forRootAsync({}),
    NestjsFormDataModule.config({
      storage: FileSystemStoredFile,
    }),
  ],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}
