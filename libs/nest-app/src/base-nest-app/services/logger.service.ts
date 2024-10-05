import { Inject, Injectable, Scope } from '@nestjs/common'
import { Params, PARAMS_PROVIDER_TOKEN, PinoLogger } from 'nestjs-pino'

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends PinoLogger {
  public constructor(@Inject(PARAMS_PROVIDER_TOKEN) params: Params) {
    super(params)

    this.setContext(LoggerService.name)
  }

  public log(obj: unknown, msg?: string, ...args: any[]) {
    return this.info(obj, msg, ...args)
  }
}

@Injectable({ scope: Scope.REQUEST })
export class LoggerRequestService extends LoggerService {
  public constructor(@Inject(PARAMS_PROVIDER_TOKEN) params: Params) {
    super(params)

    this.setContext(LoggerRequestService.name)
  }
}

@Injectable()
export class LoggerGlobalService extends LoggerService {
  public constructor(@Inject(PARAMS_PROVIDER_TOKEN) params: Params) {
    super(params)

    this.setContext(LoggerGlobalService.name)
  }
}
