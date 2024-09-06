import pino, { type Logger, type Bindings } from 'pino'
import { envBooleanOptional, envRequired, envUnionOptional } from './env'

let APP_LOG_LEVEL: pino.LevelWithSilent

let logger: Logger<never, boolean>

export function getLogger() {
  if (logger) {
    return logger
  }

  const usePrettyLog = envBooleanOptional(false, 'USE_PRETTY_LOG')

  logger = pino({
    messageKey: 'msg',
    timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        //'req.query'
      ],
    },
    formatters: {
      level: (label: string, level: number) => {
        return { 'log.level': label, level }
      },
      bindings: (bindings: Bindings) => {
        // const spanContext = getActiveSpanContext()
        // const traceBindings = spanContext
        //   ? {
        //       trace_id: spanContext.traceId,
        //       span_id: spanContext.spanId,
        //       trace_flags: spanContext.traceFlags,
        //     }
        //   : {}
        // return {
        //   ...bindings,
        //   ...traceBindings,
        //   'service.name': getServiceName(),
        //   'service.version': getFullQualifyVersion(),
        // }
        return bindings
      },
    },
    ...(usePrettyLog
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true, // --colorize
              // crlf: false, // --crlf
              // errorLikeObjectKeys: ['err', 'error'], // --errorLikeObjectKeys
              // errorProps: '', // --errorProps
              // levelFirst: false, // --levelFirst
              messageKey: 'msg', // --messageKey
              // levelKey: 'level', // --levelKey
              // messageFormat: false, // --messageFormat
              timestampKey: 'time', // --timestampKey
              // translateTime: false, // --translateTime
              ignore: 'pid,hostname', // --ignore

              // hideObject: false, // --hideObject
              singleLine: true, // --singleLine

              // The file or file descriptor (1 is stdout) to write to
              destination: 1,

              // Alternatively, pass a `sonic-boom` instance (allowing more flexibility):
              // destination: new SonicBoom({ dest: 'a/file', mkdir: true })

              // You can also configure some SonicBoom options directly
              // sync: false, // by default we write asynchronously
              // append: true, // the file is opened with the 'a' flag
              // mkdir: true, // create the target destination

              // customPrettifiers: {}
            },
          },
        }
      : undefined),
  })

  return logger
}

const getAppLogLevel = (): pino.LevelWithSilent => {
  if (APP_LOG_LEVEL) {
    return APP_LOG_LEVEL
  }

  APP_LOG_LEVEL = envUnionOptional(
    ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
    'info',
    'APP_LOG_LEVEL'
  )

  return APP_LOG_LEVEL
}

const getDefaultContext = () => {
  const APP_NAME = envRequired('APP_NAME')
  const APP_VERSION = envRequired('APP_VERSION')
  const NODE_ENV = envRequired('NODE_ENV')
  return `${NODE_ENV}/${APP_NAME}:${APP_VERSION}`
}

function createLogger(prefix: string, bindings?: any, level?: string) {
  if (!logger) {
    getLogger()
  }

  return logger.child(
    { logger: getDefaultContext(), ...bindings },
    {
      msgPrefix: prefix,
      level: level ?? getAppLogLevel(),
    }
  )
}

export { logger, createLogger, APP_LOG_LEVEL }
