import { Body, Controller, Get, Post } from '@nestjs/common'
import { CmsService } from './cms.service'
import { RequestDto, RequestMultipleDto } from './request.dto'
import { FormDataRequest } from 'nestjs-form-data'

@Controller()
export class CmsController {
  public constructor(private readonly cmsService: CmsService) {}

  @Get()
  public getHello(): string {
    return this.cmsService.getHello()
  }

  @Get('health')
  public health() {
    return
  }

  @Post('upload')
  @FormDataRequest()
  public upload(@Body() body: RequestDto) {
    console.log(`Uploaded`, { body })
    return
  }

  @Post('upload-multiple')
  @FormDataRequest()
  public async uploadMultiple(@Body() body: RequestMultipleDto) {
    console.log(`Uploaded all files`, { body })
    return
  }
}
