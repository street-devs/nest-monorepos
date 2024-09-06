import {
  type DynamicModule,
  type LogLevel,
  Scope,
  Logger,
  RequestMethod,
} from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ApiRenderInterceptor, RequestTracingInterceptor } from './interceptors'
import { GlobalApplication } from './global-application'
import { type RouteInfo } from '@nestjs/common/interfaces'
import { LoggerModule } from 'nestjs-pino'
import {
  LoggerGlobalService,
  LoggerRequestService,
  LoggerService,
} from './services/logger.service'

export interface IMonitoringModuleDefinitions {
  excludedRoutes?: RouteInfo[]
  level?: LogLevel
  requestTracing?: boolean
  autoLoggingRequestResult?: boolean
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
    requestTracing = false,
    autoLoggingRequestResult,
  }: IMonitoringModuleDefinitions): DynamicModule {
    return {
      module: BaseNestAppModule,
      imports: [
        LoggerModule.forRoot({
          pinoHttp: {
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
        {
          provide: APP_INTERCEPTOR,
          useFactory: () =>
            new ApiRenderInterceptor({
              showResponseStatus: true,
            }),
          scope: Scope.REQUEST,
        },
        GlobalApplication,
      ],
      exports: [
        LoggerService,
        LoggerRequestService,
        LoggerGlobalService,
        LoggerModule,
        GlobalApplication,
      ],
      global: true,
    }
  }
}
