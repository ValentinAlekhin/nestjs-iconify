<p align="center">
  <a href="http://nestjs.com"><img src="https://nestjs.com/img/logo_text.svg" alt="Nest Logo" width="320" /></a>
</p>

# NestJS Iconify Module
The module implements the basic <a href="https://iconify.design/docs/api/">Iconify API</a> 

## Install
    npm install nestjs-iconify

## Basic usage
```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { IconifyModule } from './iconify/iconify.module';

@Module({
  imports: [
    IconifyModule.register({
      prefix: 'iconify', // http://<HOST>/iconify/core
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

```