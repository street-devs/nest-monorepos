import { HttpStatus } from '@nestjs/common'
import { type LoggerGlobalService } from '../services'

let globalLogger: LoggerGlobalService = console as any

export function setGlobalLogger(logger: any): void {
  globalLogger = logger
}

export function printLogInfo(context: string, args?: unknown): void {
  printLog('info', context, args)
}

export function printLogWarning(context: string, args?: unknown): void {
  printLog('warn', context, args)
}

export function printLogError(
  context: string,
  error?: Error | undefined | null,
  args?: unknown
): void {
  globalLogger.error(
    {
      data: args || null,
      err: error ? parseExceptionDataFromError(error) : undefined,
    },
    `[${context}]`
  )
}

function printLog(
  type: 'info' | 'error' | 'warn',
  context: string,
  args?: unknown
): void {
  globalLogger[type](
    {
      data: args || null,
    },
    `[${context}]`
  )
}

function parseExceptionDataFromError(err: Error & { code?: HttpStatus }): {
  msg: string
  stackTrace?: string[] | undefined
  code: HttpStatus
} {
  return {
    msg: err.message,
    code: err.code || HttpStatus.BAD_REQUEST,
    stackTrace: err.stack?.split('\n').map((item) => item.trim()),
  }
}
