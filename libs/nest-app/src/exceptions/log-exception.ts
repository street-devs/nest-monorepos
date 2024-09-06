import { type UnknownRecord } from '@lib/common'
import { printLogError } from '../helpers'

export interface ILogExceptionResponse {
  exceptionName: string
  msg: string
  data: UnknownRecord
}

export function logException(
  exception: Error,
  context: string,
  extras?: UnknownRecord
): ILogExceptionResponse {
  const stack: string[] = (
    exception.stack ? exception.stack.split('\n') : []
  ).map((item: string) => item.trim())

  const args = {
    extras: extras || {},
    err: { ...exception, stack },
  }

  printLogError(context, exception, { args, msg: exception.message })

  return {
    exceptionName: context,
    msg: exception.message,
    data: args,
  }
}
