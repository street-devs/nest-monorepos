import { envNumberOptional, envOptional } from '@lib/common'
import {
  InternalServerErrorException,
  type INestApplication,
} from '@nestjs/common'
import {
  type CorsOptions,
  type CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface'

interface IApplication
  extends Pick<INestApplication, 'listen' | 'getUrl' | 'enableCors' | 'get'> {}

export interface IBootstrapAppOptions<T = INestApplication> {
  appDirName: string
  initApp: () => Promise<T>
  onBeforeStartApp?: (application: T) => Promise<void>
  onAfterStartedApp?: (application: T, appUri: string) => Promise<void>
  options?: {
    cors?: CorsOptions | CorsOptionsDelegate<any> | boolean
  }
}

export class GlobalApplication {
  private static _application: INestApplication

  private static _appUrl: string

  private static _appDir: string

  private static _isAppBoostraped: boolean

  public static async bootstrap<T extends IApplication>({
    appDirName,
    initApp,
    onBeforeStartApp,
    onAfterStartedApp,
    options = { cors: true },
  }: IBootstrapAppOptions<T>) {
    if (GlobalApplication._isAppBoostraped) {
      throw new InternalServerErrorException('App already bootstrapped')
    }

    const application: T = await initApp()

    GlobalApplication._appDir = appDirName

    if (onBeforeStartApp) {
      await onBeforeStartApp(application)
    }

    if (options?.cors) {
      application.enableCors(
        options?.cors === true
          ? { credentials: true, origin: '*' }
          : options.cors
      )
    }

    GlobalApplication._application = application as unknown as INestApplication

    await GlobalApplication._application.listen(
      envNumberOptional(3000, 'PORT'),
      envOptional('0.0.0.0', 'SERVER__ADDRESS'),
      async () => {
        const address = await application.getUrl()

        GlobalApplication._appUrl = address

        if (onAfterStartedApp) {
          await onAfterStartedApp(application, address)
        }

        GlobalApplication._isAppBoostraped = true
      }
    )
  }

  public static app<T = INestApplication>(): T {
    return GlobalApplication._application as unknown as T
  }

  public static appUrl(): string {
    return GlobalApplication._appUrl
  }

  public static appDir(): string {
    return GlobalApplication._appDir
  }
}
