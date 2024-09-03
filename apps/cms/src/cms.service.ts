import { Injectable } from '@nestjs/common'

@Injectable()
export class CmsService {
  public getHello(): string {
    return 'Hello World!'
  }
}
