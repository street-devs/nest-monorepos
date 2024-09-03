export class BaseException<DataType = any> extends Error {
  public msg?: string
  public data?: DataType
  public help?: string | string[] | any
  public code?: number
  public stackTrace?: string[]
  public shouldShowSuccessStatusCode?: boolean

  public constructor(partial?: Partial<BaseException<DataType>>) {
    const msg = partial?.message || partial?.msg || 'BaseException'

    super(msg)

    Object.assign(this, {
      code: 400,
      msg,
      shouldShowSuccessStatusCode: false,
      ...(partial || {}),
    })

    if (this.stack) {
      this.stackTrace = this.stack.split('\n').map((item) => item.trim())
    }
  }

  public toString(): string {
    return JSON.stringify({
      msg: this.msg,
      data: this.data,
      help: this.help,
      code: this.code,
      stackTrace: this.stackTrace,
    })
  }
}
