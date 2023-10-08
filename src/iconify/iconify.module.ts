import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  ICONIFY_MODULE_OPTIONS,
  IconifyModuleAsyncOptions,
  IconifyModuleOptions,
  IconifyModuleOptionsFactory,
} from './iconify-options.interface';
import { IconifyService } from './iconify.service';
import { createUnifyDynamicController } from './iconify.controller';
import { createIconifyCoreDynamicController } from './core/iconify-core.controller';
import { IconifyCoreService } from './core/iconify-core.service';

@Module({})
export class IconifyModule {
  static register(options: IconifyModuleOptions): DynamicModule {
    return {
      module: IconifyModule,
      controllers: [
        createUnifyDynamicController(options),
        createIconifyCoreDynamicController(options),
      ],
      providers: [IconifyService, IconifyCoreService],
      exports: [IconifyService, IconifyCoreService],
    };
  }

  // static registerAsync(options: IconifyModuleAsyncOptions): DynamicModule {
  //   return {
  //     module: IconifyModule,
  //     imports: [...(options?.imports || [])],
  //     providers: [
  //       ...this.createAsyncProviders(options),
  //       IconifyCoreService,
  //       IconifyCoreService,
  //     ],
  //     controllers: [
  //       createUnifyDynamicController(options.useFactory()),
  //       createIconifyCoreDynamicController(options),
  //     ],
  //     exports: [IconifyCoreService, IconifyCoreService],
  //   };
  // }

  private static createAsyncProviders(
    options: IconifyModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: IconifyModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: ICONIFY_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: ICONIFY_MODULE_OPTIONS,
      useFactory: async (optionsFactory: IconifyModuleOptionsFactory) =>
        await optionsFactory.createOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
