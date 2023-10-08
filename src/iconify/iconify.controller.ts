import { Get, Controller, Param } from '@nestjs/common';
import { IconifyService } from './iconify.service';
import { IconifyModuleOptions } from './iconify-options.interface';

export const createUnifyDynamicController = (
  controllerOptions: IconifyModuleOptions,
) => {
  @Controller(controllerOptions.prefix)
  class IconifyController {
    constructor(readonly service: IconifyService) {}

    @Get()
    create() {
      return this.service.test();
    }

    @Get('collections')
    collections() {
      return this.service.collections();
    }

    @Get('collections/:prefix')
    lookupCollection(@Param('prefix') prefix: string) {
      return this.service.lookupCollections(prefix);
    }
  }

  return IconifyController;
};
