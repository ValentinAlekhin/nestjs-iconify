import { Module } from '@nestjs/common';
import { IconifyModule } from './iconify/iconify.module';

@Module({
  imports: [
    IconifyModule.register({
      prefix: 'iconify',
    }),
    // IconifyModule.registerAsync({
    //   useFactory: () => ({
    //     prefix: 'iconify',
    //   }),
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
