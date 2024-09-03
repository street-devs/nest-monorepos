import { type UnknownRecord, logger } from '@lib/common'

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
  const stack: string[] = (
    exception.stack ? exception.stack.split('\n') : []
  ).map((item: string) => item.trim())

  const args = {
    extras: extras || {},
    err: { ...exception, stack },
  }

  logger.error({ args, msg: exception.message }, context)

  return {
    exceptionName: context,
    message: exception.message,
    data: args,
  }
}
