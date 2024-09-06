import { type UnknownRecord } from '@lib/common'
import { printLogError } from '../helpers'

export interface ILogExceptionResponse {
  exceptionName: string
  message: string
  data: UnknownRecord
}

export function logException(
  exception: Error,
  context: string,
  extras?: UnknownRecord
): ILogExceptionResponse {
  const stackTrace: string[] = (
    exception.stack ? exception.stack.split('\n') : []
  ).map((item: string) => item.trim())

  printLogError(context, {
    extras: extras || {},
    exception: { ...exception, stackTrace },
    message: exception.message,
  })

  return {
    exceptionName: context,
    message: exception.message,
    data: {
      extras: extras || {},
      exception: { ...exception, stackTrace },
    },
  }
}
