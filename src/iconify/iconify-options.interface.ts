import { ModuleMetadata, Type } from '@nestjs/common';

export const ICONIFY_MODULE_OPTIONS = 'ICONIFY_MODULE_OPTIONS';

export interface IconifyModuleOptions {
  prefix: string;
}

export interface IconifyModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<IconifyModuleOptionsFactory>;
  useClass?: Type<IconifyModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<IconifyModuleOptions> | IconifyModuleOptions;
  inject?: any[];
}

export interface IconifyModuleOptionsFactory {
  createOptions(): Promise<IconifyModuleOptions> | IconifyModuleOptions;
}
