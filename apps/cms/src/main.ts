import { type AbstractHttpAdapter, NestFactory } from '@nestjs/core'
import {
  type INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import {
  type NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify'
import {
  GlobalApplication,
  logException,
  LoggerGlobalService,
  setGlobalLogger,
} from '@lib/nest-app'
import { envOptional, envRequired, loadEnv } from '@lib/common'
import FastifyCookie from '@fastify/cookie'
import FastifyMultipart from '@fastify/multipart'
import { CmsModule } from './cms.module'
import { Logger } from 'nestjs-pino'

loadEnv(
  ['.env.production', '.env.development', '.env'].map(
    (file) => `${__dirname}/../../../apps/cms/${file}`
  )
)

GlobalApplication.bootstrap({
  // Specifies the current directory name
  appDirName: __dirname,
  // Creates and returns a Nest.js application instance
  // uses the FastifyAdapter as the HTTP adapter
  initApp: async () => {
    return NestFactory.create<NestFastifyApplication>(
      CmsModule,
      new FastifyAdapter() as unknown as AbstractHttpAdapter,
      {
        bufferLogs: true,
        abortOnError: false,
      }
    )
  },
  // Executed before starting the application.
  onBeforeStartApp: async (application: NestFastifyApplication) => {
    // Register logger
    application.useLogger(application.get(Logger))

    const adaptorInstance = application.getHttpAdapter().getInstance()

    await adaptorInstance.register(FastifyCookie)
    await adaptorInstance.register(FastifyMultipart)

    // Enabling versioning
    application.enableVersioning({
      type: VersioningType.URI,
    })

    application.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true })
    )

    // Register swagger
    registerSwagger(application)
  },
  // Executed after the application has started
  onAfterStartedApp: async (application, appUri) => {
    // Sets up a global logger
    const globalLogger = application.get(LoggerGlobalService)

    setGlobalLogger(globalLogger)

    globalLogger.setContext(envRequired('APP_NAME'))

    // Log some information
    globalLogger.info(`NODE_ENV ${envRequired('NODE_ENV')}`)
    globalLogger.info(`Server started at ${appUri}`)
    globalLogger.info(`Swagger URL ${appUri + '/swagger'}`)
    globalLogger.info(`Download Swagger JSON ${appUri + '/swagger-json'}`)
  },
}).catch((e) => {
  logException(e, envRequired('APP_NAME'))
})

/**
 * Register Swagger documentation for the application
 */
function registerSwagger(application: INestApplication): void {
  // Only enable Swagger in these environments
  const SWAGGER_ENVS: string[] = ['local', 'development']

  if (!SWAGGER_ENVS.includes(envOptional('', 'NODE_ENV'))) {
    return
  }

  const config = new DocumentBuilder()
    .setTitle(envRequired('APP_NAME'))
    .setDescription('An application built on top of NestJS')
    .setContact(
      'Justin Phan',
      'https://github.com/duysolo',
      'duypt.dev@gmail.com'
    )
    .setLicense('MIT', 'https://github.com/duysolo')
    .setVersion(envOptional('1.0', 'APP_VERSION'))
    .addBearerAuth()
    .addBasicAuth()
    .addCookieAuth('Authorization')
    .build()

  // Create and set up the Swagger UI
  const document = SwaggerModule.createDocument(application, config)
  SwaggerModule.setup('swagger', application, document)
}
