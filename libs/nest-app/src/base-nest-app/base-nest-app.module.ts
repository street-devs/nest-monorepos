import {
  type DynamicModule,
  type LogLevel,
  Scope,
  Logger,
  RequestMethod,
} from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ApiRenderInterceptor, RequestTracingInterceptor } from './interceptors'
import { type RouteInfo } from '@nestjs/common/interfaces'
import { LoggerModule, type Params } from 'nestjs-pino'
import {
  LoggerGlobalService,
  LoggerRequestService,
  LoggerService,
} from './services/logger.service'
import { envBooleanOptional } from '@lib/common'

export interface IMonitoringModuleDefinitions {
  excludedRoutes?: RouteInfo[]
  level?: LogLevel
  autoLoggingRequestResult?: boolean
  pinoHttp?: Params['pinoHttp']
  requestTracing?: boolean
  transformReponse?: boolean
}

const defaultExcludedRoutes = [
  {
    method: RequestMethod.ALL,
    path: '/health',
  },
]

export class BaseNestAppModule {
  public static forRoot({
    excludedRoutes,
    autoLoggingRequestResult,
    pinoHttp,
    requestTracing = false,
    transformReponse = false,
  }: IMonitoringModuleDefinitions): DynamicModule {
    return {
      module: BaseNestAppModule,
      imports: [
        LoggerModule.forRoot({
          pinoHttp: {
            ...(envBooleanOptional(false, 'USE_PRETTY_LOG')
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
                      timestampKey: '@timestamp', // --timestampKey
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
            customAttributeKeys: { responseTime: 'tookMs' },
            autoLogging: autoLoggingRequestResult || false,
            ...pinoHttp,
          },
          exclude: excludedRoutes || defaultExcludedRoutes,
        }),
      ],
      providers: [
        LoggerService,
        LoggerRequestService,
        LoggerGlobalService,
        {
          provide: Logger,
          useExisting: LoggerService,
        },
        ...(requestTracing
          ? [
              {
                provide: APP_INTERCEPTOR,
                useClass: RequestTracingInterceptor,
              },
            ]
          : []),
        ...(transformReponse
          ? [
              {
                provide: APP_INTERCEPTOR,
                useFactory: () =>
                  new ApiRenderInterceptor({
                    showResponseStatus: true,
                  }),
                scope: Scope.REQUEST,
              },
            ]
          : []),
      ],
      exports: [
        LoggerService,
        LoggerRequestService,
        LoggerGlobalService,
        LoggerModule,
        Logger,
      ],
      global: true,
    }
  }
}
