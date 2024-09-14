import { DynamicModule, Injectable } from '@nestjs/common'
import { SnowflakeId, SnowflakeIdOptions } from './helpers'

@Injectable()
export class SnowflakeIdService {
  private readonly _snowflakeId: SnowflakeId

  public constructor(options?: SnowflakeIdOptions) {
    this._snowflakeId = new SnowflakeId(options)
  }

  public generate() {
    return this._snowflakeId.generate()
  }

  public decode(id: bigint) {
    return this._snowflakeId.decode(id)
  }
}

export class SnowflakeIdModule {
  public static forRoot(
    options?: SnowflakeIdOptions & { global?: boolean }
  ): DynamicModule {
    return {
      module: SnowflakeIdModule,
      providers: [
        {
          provide: SnowflakeIdService,
          useValue: new SnowflakeIdService(options),
        },
      ],
      exports: [SnowflakeIdService],
      global: options?.global || false,
    }
  }
}
