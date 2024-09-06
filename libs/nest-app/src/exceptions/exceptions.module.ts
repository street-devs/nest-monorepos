import { type DynamicModule, type ModuleMetadata, Scope } from '@nestjs/common'
import { GlobalExceptionFilter } from './global.exception-filter'
import { APP_FILTER } from '@nestjs/core'
import { type Nullable } from '@lib/common'

export interface IExceptionCatchingOptions {
  // Use this option to handle some events before the exception is transformed
  beforeTransformException?: (req: any, exception: any) => Promise<any>
  // Use this option to handle some events after the exception is transformed
  afterTransformException?: (
    req: any,
    transformedException: any,
    exception: any
  ) => Promise<any>
  shouldShowSuccessStatusCode?: boolean
}

export interface IExceptionsModuleOptions
  extends Pick<ModuleMetadata, 'imports'> {
  options?: Nullable<IExceptionCatchingOptions>
}

export const EXCEPTION_CATCHING_OPTIONS = Symbol('EXCEPTION_CATCHING_OPTIONS')

export class ExceptionsModule {
  public static forRootAsync({
    imports,
    options,
  }: IExceptionsModuleOptions): DynamicModule {
    return {
      module: ExceptionsModule,
      imports: imports || [],
      providers: [
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
          scope: Scope.REQUEST,
        },
        {
          provide: EXCEPTION_CATCHING_OPTIONS,
          useValue: options ?? {
            shouldShowSuccessStatusCode: false,
          },
        },
      ],
      exports: [EXCEPTION_CATCHING_OPTIONS],
    }
  }
}
