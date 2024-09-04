import { envNumberOptional, envOptional } from '@lib/common'
import { type INestApplication } from '@nestjs/common'
import {
  type CorsOptions,
  type CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface'

interface IApplication
  extends Pick<INestApplication, 'listen' | 'getUrl' | 'enableCors'> {}

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
  }: IBootstrapAppOptions<T>): Promise<void> {
    if (GlobalApplication._isAppBoostraped) {
      return
    }

    console.log(`Boostrapping app in directory: ${appDirName}`)

    GlobalApplication.setAppDir(appDirName)

    const application: T = await initApp()

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

    await GlobalApplication.setApp(application).listen(
      envNumberOptional(3000, 'PORT'),
      envOptional('0.0.0.0', 'SERVER__ADDRESS'),
      async () => {
        const address = await application.getUrl()

        GlobalApplication.setAppUrl(address)

        if (onAfterStartedApp) {
          await onAfterStartedApp(application, address)
        }

        GlobalApplication._isAppBoostraped = true
      }
    )
  }

  public static setApp<T = INestApplication>(app: T): T {
    GlobalApplication._application = app as unknown as INestApplication

    return GlobalApplication._application as unknown as T
  }

  public static setAppUrl(url: string): string {
    GlobalApplication._appUrl = url

    return GlobalApplication._appUrl
  }

  public static setAppDir(dir: string): string {
    GlobalApplication._appDir = dir

    return GlobalApplication._appDir
  }

  public static app<T = INestApplication>(): T {
    return GlobalApplication._application as unknown as T
  }

  public static get appUrl(): string {
    return GlobalApplication._appUrl
  }

  public static get appDir(): string {
    return GlobalApplication._appUrl
  }
}
