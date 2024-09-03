import { Controller, Get } from '@nestjs/common'
import { CmsService } from './cms.service'

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
}
