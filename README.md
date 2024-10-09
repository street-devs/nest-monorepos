<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A starter template for NestJS applications with Monorepos supported</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

This template supports **Fastify Adaptor** by default.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- Visit the [NestJS - Workspaces - Monorepo mode](https://docs.nestjs.com/cli/monorepo#monorepo-mode) to learn more about the supported monorepo mode by NestJS.

## Relevant modules
- [ExceptionsModule](https://github.com/street-devs/nest-monorepos/wiki/ExceptionsModule): offers global exception handling for HTTP and GraphQL contexts in a NestJS application. It allows for customization to execute additional operations before and after exception transformations. Here’s a quick guide on how to use and tailor the module to your needs.
- [GlobalApplication](https://github.com/street-devs/nest-monorepos/wiki/GlobalApplication): a utility that simplifies the bootstrapping of a NestJS application. It offers a structured approach to initializing and managing the application’s lifecycle, including handling CORS options and executing pre/post startup hooks. This class ensures the app is bootstrapped only once and provides easy access to the app instance, URL, and directory details throughout its lifecycle.
- [BaseNestAppModule](https://github.com/street-devs/nest-monorepos/wiki/BaseNestAppModule): a flexible, modular utility that integrates advanced logging, request tracing, and API response transformations into your NestJS application. It utilizes `nestjs-pino` for powerful logging and includes interceptors and services to improve observability, structured logging, and monitoring.

## Dependencies
- [nestjs-form-data](https://www.npmjs.com/package/nestjs-form-data): a NestJS middleware for handling `multipart/form-data`, which is primarily used for uploading files.

- [nestjs-pino](https://www.npmjs.com/package/nestjs-pino): Platform agnostic logger for NestJS based on Pino with REQUEST CONTEXT IN EVERY LOG.
```
{"req":{"id":"req-1","method":"POST","url":"/users/-/blog/post","query":{},"headers":{"host":"localhost:3000","content-type":"application/json","user-agent":"insomnia/8.4.5","accept":"*/*","content-length":"151"},"remoteAddress":"127.0.0.1","remotePort":61318},"context":"Mercury CMS","data":{"extras":{},"exception":{"_type":"BaseException","data":{"slug":"first-post"},"code":400,"shouldShowSuccessStatusCode":true,"message":"PostSlugExistsException","stackTrace":["Error: PostSlugExistsException","at PostRepositorySql._checkSlugExistsBeforeCreateUpdate (/Users/duysolo/DATA/Works/Repos/Mine/nodejs/estations/dist/apps/cms/main.js:2580:19)","at async PostRepositorySql.create (/Users/duysolo/DATA/Works/Repos/Mine/nodejs/estations/dist/apps/cms/main.js:2458:9)","at async CreatePostHandler.execute (/Users/duysolo/DATA/Works/Repos/Mine/nodejs/estations/dist/apps/cms/main.js:1466:21)"]},"message":"PostSlugExistsException"}}
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start cms

# watch mode
$ npm run start:dev cms

# production mode
$ npm run start:prod cms
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Generate new modules

```bash
# Generate new application
$ nest generate app your-app-name

# Generate new library
$ nest generate library your-library-name
```

## Support

- Author - [Justin Phan](https://github.com/duysolo)
- Facebook - [Justin Phan](https://www.facebook.com/duypt.dev)
- Website - [https://duypt.dev](https://duypt.dev)

## License

Nest Monorepos is [MIT licensed](https://github.com/street-devs/nest-monorepos/blob/main/LICENSE).
