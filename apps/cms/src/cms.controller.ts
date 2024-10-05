import { Controller, Get } from '@nestjs/common'
import { CmsService } from './cms.service'

@Controller()
export class CmsController {
  public constructor(private readonly _cmsService: CmsService) {}

  @Get()
  public getHello(): string {
    return this._cmsService.getHello()
  }

  @Get('health')
  public health() {
    return
  }
}
