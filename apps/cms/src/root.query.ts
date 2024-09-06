import { Injectable } from '@nestjs/common'
import { Field, ObjectType, Query } from '@nestjs/graphql'

@ObjectType()
export class DefaultResponse {
  @Field(() => String)
  public message: string

  @Field(() => String)
  public status: string
}

@Injectable()
export class RootQuery {
  @Query(() => DefaultResponse)
  public async health(): Promise<DefaultResponse> {
    return {
      message: 'Health Check',
      status: 'OK',
    }
  }
}
