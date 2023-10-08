<p align="center">
  <a href="http://nestjs.com"><img src="https://nestjs.com/img/logo_text.svg" alt="Nest Logo" width="320" /></a>
</p>

# NestJS Iconify Module
The module implements the basic <a href="https://iconify.design/docs/api/queries.html">Iconify API</a> 

## Install
    npm install nestjs-iconify

## Todo routes
- [x] /{prefix}/{name}.svg
- [ ] /{prefix}.css?icons={icons}
- [x] /{prefix}.json?icons={icons}
- [x] /last-modified
- [x] /collections
- [x] /collection
- [ ] /search
- [ ] /keywords

## Basic usage
```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { IconifyModule } from 'nestjs-iconify'

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