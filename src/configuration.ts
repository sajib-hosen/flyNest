import { registerAs } from '@nestjs/config';
import { AppConfig } from './models/server.config';

const loadConfig = (): AppConfig => {
  return {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    node_env: process.env.NODE_ENV,
    db: {
      connectionString: process.env.DATABASE_URL,
    },
    jwt: {
      privateKey: Buffer.from(process.env.AUTH_PRIVATE_KEY, 'base64').toString(
        'utf-8',
      ),
      publicKey: Buffer.from(process.env.AUTH_PUBLIC_KEY, 'base64').toString(
        'utf-8',
      ),
      issuer: process.env.JWT_ISSUER,
      jwt_access_expires: process.env.JWT_ACCESS_EXPIRES,
      jwt_refresh_expires: process.env.JWT_REFRESH_EXPIRES,
    },
  };
};

export const appConfig = registerAs('appconfig', loadConfig);
