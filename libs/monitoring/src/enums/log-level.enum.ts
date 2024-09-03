export enum LogLevelEnum {
  FATAL = 'fatal',
  ERROR = 'error',
  WARNING = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
  SILENT = 'silent',
}

export const ALL_LOG_LEVELS: LogLevelEnum[] | string[] = [
  LogLevelEnum.FATAL,
  LogLevelEnum.ERROR,
  LogLevelEnum.WARNING,
  LogLevelEnum.INFO,
  LogLevelEnum.DEBUG,
  LogLevelEnum.TRACE,
  LogLevelEnum.SILENT,
]
