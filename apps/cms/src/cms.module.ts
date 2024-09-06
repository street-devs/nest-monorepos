import { Module } from '@nestjs/common'
import { BaseNestAppModule, ExceptionsModule } from '@lib/nest-app'
import { CmsController } from './cms.controller'
import { CmsService } from './cms.service'
// import { RootQuery } from './root.query'
// import { Enhancer, GraphQLModule } from '@nestjs/graphql'
// import { envBooleanOptional } from '@lib/common'
// import { join } from 'path'
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'

@Module({
  imports: [
    BaseNestAppModule.forRoot({
      autoLoggingRequestResult: false,
      requestTracing: true,
      transformReponse: true,
    }),
    ExceptionsModule.forRootAsync({}),
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   useFactory: () => {
    //     return {
    //       debug: envBooleanOptional(false, 'GRAPHQL_DEBUG'),
    //       playground: envBooleanOptional(false, 'GRAPHQL_PLAYGROUND'),
    //       autoSchemaFile: join(process.cwd(), 'apps/cms/generated/schema.gql'),
    //       sortSchema: true,
    //       fieldResolverEnhancers: ['interceptors'] as Enhancer[],
    //       autoTransformHttpErrors: true,
    //       context: (context) => context,
    //     }
    //   },
    // }),
  ],
  controllers: [CmsController],
  providers: [
    CmsService,
    // RootQuery,
  ],
})
export class CmsModule {}
