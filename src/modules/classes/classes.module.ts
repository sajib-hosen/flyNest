import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { AuthModule } from '../auth/auth.module';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from 'src/configuration';

@Module({
  imports: [ConfigModule.forFeature(appConfig), AuthModule, DrizzleModule],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
