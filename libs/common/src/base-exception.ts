export class BaseException<DataType = any> extends Error {
  public data?: DataType
  public help?: string | string[] | any
  public code?: number
  public stackTrace?: string[]
  public shouldShowSuccessStatusCode?: boolean

  public constructor(partial?: Partial<BaseException<DataType>>) {
    const message = partial?.message || 'BaseException'

    super(message)

    Object.assign(this, {
      code: 400,
      message,
      shouldShowSuccessStatusCode: false,
      ...(partial || {}),
    })

    if (this.stack) {
      this.stackTrace = this.stack.split('\n').map((item) => item.trim())
    }
  }

  public toString(): string {
    return JSON.stringify({
      message: this.message,
      data: this.data,
      help: this.help,
      code: this.code,
      stackTrace: this.stackTrace,
    })
  }
}
