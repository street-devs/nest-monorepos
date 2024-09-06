import { DynamicModule, Module, RequestMethod, Logger } from '@nestjs/common'
import { RouteInfo } from '@nestjs/common/interfaces'
import { LoggerModule, Logger as NestPinoLogger, PinoLogger } from 'nestjs-pino'
import {
  LoggerGlobalService,
  LoggerRequestService,
  LoggerService,
} from './services'
import { setGlobalLogger } from './helpers'
import { RequestTracingInterceptor } from './interceptors'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LogLevelEnum } from './enums'
import { getLogger } from '@lib/common'

export interface IMonitoringModuleDefinitions {
  excludedRoutes?: RouteInfo[]
  level?: LogLevelEnum
  requestTracing?: boolean
  autoLoggingRequestResult?: boolean
}

const defaultExcludedRoutes = [
  {
    method: RequestMethod.ALL,
    path: '/health',
  },
]

export const loggerServiceToInjectNestApp = () =>
  new NestPinoLogger(
    new PinoLogger({
      pinoHttp: getLogger(),
    }),
    {}
  )

@Module({})
export class MonitoringModule {
  public constructor(logger: LoggerGlobalService) {
    setGlobalLogger(logger)
  }

  public static async forRoot({
    excludedRoutes,
    requestTracing = false,
    autoLoggingRequestResult,
  }: IMonitoringModuleDefinitions): Promise<DynamicModule> {
    return {
      module: MonitoringModule,
      imports: [
        LoggerModule.forRoot({
          pinoHttp: {
            logger: getLogger(),
            customAttributeKeys: { responseTime: 'tookMs' },
            autoLogging: autoLoggingRequestResult || false,
          },
          exclude: excludedRoutes || defaultExcludedRoutes,
        }),
      ],
      providers: [
        LoggerService,
        LoggerRequestService,
        LoggerGlobalService,
        ...(requestTracing
          ? [
              {
                provide: APP_INTERCEPTOR,
                useClass: RequestTracingInterceptor,
              },
            ]
          : []),
        {
          provide: Logger,
          useExisting: LoggerService,
        },
      ],
      exports: [
        LoggerService,
        LoggerRequestService,
        LoggerGlobalService,
        LoggerModule,
      ],
      global: true,
    }
  }
}
