export interface JwtConfig {
  privateKey: string;
  publicKey: string;
  issuer?: string;
  jwt_access_expires?: string;
  jwt_refresh_expires?: string;
}

export interface AppConfig {
  port: number;
  node_env: string;
  db: {
    connectionString?: string;
  };
  jwt: JwtConfig;
}
