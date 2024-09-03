import {
  DynamicModule,
  Module,
  ModuleMetadata,
  NestModule,
} from '@nestjs/common'
import { GlobalExceptionFilter } from './global.exception-filter'
import { GlobalApplication } from '../app'

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
    GlobalExceptionFilter,
    {
      provide: EXCEPTION_CATCHING_CALLBACKS,
      useValue: {},
    },
  ],
  exports: [GlobalExceptionFilter, EXCEPTION_CATCHING_CALLBACKS],
})
export class ExceptionsModule implements NestModule {
  public constructor(private readonly _filter: GlobalExceptionFilter) {}

  public configure(): void {
    GlobalApplication.app().useGlobalFilters(this._filter)
  }

  public static forRootAsync(options: IExceptionsModuleOptions): DynamicModule {
    return {
      module: ExceptionsModule,
      imports: options.imports || [],
      providers: [
        GlobalExceptionFilter,
        {
          provide: EXCEPTION_CATCHING_CALLBACKS,
          useValue: options.callback,
        },
      ],
      exports: [GlobalExceptionFilter, EXCEPTION_CATCHING_CALLBACKS],
    }
  }
}
