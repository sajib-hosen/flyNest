import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from 'src/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfig } from 'src/models/server.config';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],

      useFactory: (configService: ConfigService) => {
        const config = configService.get<JwtConfig>('appconfig.jwt');

        return {
          privateKey: config.privateKey,
          publicKey: config.publicKey,
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '1d',
            issuer: config.issuer,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
