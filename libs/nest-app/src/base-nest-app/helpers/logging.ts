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

export function printLogError(context: string, args?: unknown): void {
  globalLogger.error(
    {
      data: args || null,
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
