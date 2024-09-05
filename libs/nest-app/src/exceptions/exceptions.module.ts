import { DynamicModule, Module, ModuleMetadata, Scope } from '@nestjs/common'
import { GlobalExceptionFilter } from './global.exception-filter'
import { APP_FILTER } from '@nestjs/core'

export interface IExceptionCatchingCallbacks {
  beforeTransformException?: (req: any, exception: any) => Promise<any>
  afterTransformException?: (
    req: any,
    transformedException: any,
    exception: any
  ) => Promise<any>
}

export interface IExceptionsModuleOptions
  extends Pick<ModuleMetadata, 'imports'> {
  callback: IExceptionCatchingCallbacks
}

export const EXCEPTION_CATCHING_CALLBACKS = Symbol(
  'EXCEPTION_CATCHING_CALLBACKS'
)

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
      scope: Scope.REQUEST,
    },
    {
      provide: EXCEPTION_CATCHING_CALLBACKS,
      useValue: {},
    },
  ],
  exports: [EXCEPTION_CATCHING_CALLBACKS],
})
export class ExceptionsModule {
  public static forRootAsync(options: IExceptionsModuleOptions): DynamicModule {
    return {
      module: ExceptionsModule,
      imports: options.imports || [],
      providers: [
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
          scope: Scope.REQUEST,
        },
        {
          provide: EXCEPTION_CATCHING_CALLBACKS,
          useValue: options.callback,
        },
      ],
      exports: [EXCEPTION_CATCHING_CALLBACKS],
    }
  }
}
