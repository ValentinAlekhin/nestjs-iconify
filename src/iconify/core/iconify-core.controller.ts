import {
  Get,
  Controller,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { IconifyCoreService } from './iconify-core.service';
import { IconifyModuleOptions } from '../iconify-options.interface';
import {
  CollectionQueryDto,
  JsonCssQueryDto,
  LastModifiedQueryDto,
  SvgQueryDto,
} from './iconify-core.dto';
import { Response } from 'express';

export const createIconifyCoreDynamicController = (
  controllerOptions: IconifyModuleOptions,
) => {
  @Controller(`${controllerOptions.prefix}/core`)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  class IconifyCoreController {
    constructor(readonly service: IconifyCoreService) {}

    @Get('collections')
    collections() {
      return this.service.collections();
    }

    @Get('collection')
    collection(@Query() query: CollectionQueryDto) {
      return this.service.collection(query);
    }

    @Get('last-modified')
    async lastModified(@Query() query: LastModifiedQueryDto) {
      const lastModified = await this.service.lastModified(query);

      return {
        lastModified,
      };
    }

    @Get(':prefix')
    async jsonCss(
      @Param('prefix') prefixParam: string,
      @Query() query: JsonCssQueryDto,
      @Res() res: Response,
    ) {
      const [prefix, ext] = prefixParam.split('.');

      if (!prefix || !ext) throw new BadRequestException();

      switch (ext) {
        case 'css':
          return this.service.css(prefix, query, res);
        case 'json':
          return this.service.json(prefix, query, res);
        default:
          return new BadRequestException();
      }
    }

    @Get(':prefix/:name')
    async svg(
      @Param('name') name: string,
      @Param('prefix') prefix: string,
      @Query() query: SvgQueryDto,
      @Res() res: Response,
    ) {
      return this.service.svg(prefix, name.split('.')[0], query, res);
    }
  }

  return IconifyCoreController;
};
