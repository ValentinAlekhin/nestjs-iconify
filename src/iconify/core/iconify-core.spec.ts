import { HttpStatus, ValidationPipe } from '@nestjs/common';

import * as request from 'supertest';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';

describe('App', () => {
  const baseUrl = `http://localhost:3000/iconify/core`;

  beforeAll(async () => {
    global.app = await NestFactory.create(AppModule);

    global.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await global.app.listen(3000);
  });

  afterAll(() => {
    global.app.close();
  });

  describe.each([
    { url: '/collections' },
    { url: '/collection?prefix=material-symbols&info=true' },
    { url: '/last-modified?prefixes=material-symbols,carbon' },
    { url: '/material-symbols.json?icons=ac-unit-sharp' },
    {
      url: '/material-symbols/ac-unit-sharp.svg?flip=true&rotate=20&download=true&top=20',
    },
    {
      url: '/openmoji.css?icons=axe&selector=.axe-icon&square=true&pseudo=true&common=.test&var=variable',
    },
  ])('$url (GET)', ({ url }) => {
    it('it should OK', () => {
      return request(baseUrl).get(url).expect(HttpStatus.OK);
    });
  });
});
