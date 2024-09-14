import { HttpStatus } from '@nestjs/common'

export class BaseException<DataType = any> extends Error {
  protected readonly _type = 'BaseException'

  public data?: DataType
  public help?: string | string[] | unknown
  public code?: number
  public shouldShowSuccessStatusCode?: boolean

  public constructor(partial?: Partial<BaseException<DataType>>) {
    super()

    const message = partial?.message || this._type

    const initial = {
      code: HttpStatus.BAD_REQUEST,
      message,
      shouldShowSuccessStatusCode: true,
      ...(partial || {}),
    }

    Object.assign(this, initial)
  }

  public toString(): string {
    return JSON.stringify({
      message: this.message,
      data: this.data,
      help: this.help,
      code: this.code,
      stackTrace: this.getStack(),
    })
  }

  public getStack(): string[] {
    return this.stack?.split('\n').map((item) => item.trim()) ?? []
  }
}
