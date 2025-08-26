import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from '../students/students.module';
import { ClassesModule } from '../classes/classes.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from 'src/configuration';
import { JwtAuthGuard } from 'src/guards/http/jwt.auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    DrizzleModule,
    AuthModule,
    StudentsModule,
    ClassesModule,
  ],

  controllers: [AppController],

  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    AppService,
  ],
})
export class AppModule {}
