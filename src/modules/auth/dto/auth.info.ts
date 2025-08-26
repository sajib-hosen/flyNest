export interface AuthInfo {
  userId: number;
  email: string;
  tokenType?: 'access' | 'refresh';
}

export function isAuthInfo(obj: unknown): obj is AuthInfo {
  return (
    typeof obj === 'object' && obj !== null && 'userId' in obj && 'email' in obj
  );
}
