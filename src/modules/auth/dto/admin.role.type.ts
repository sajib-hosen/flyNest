export type AdminRoleType = 'admin' | 'teacher';

export enum AdminRolePower {
  teacher = 1 << 1,
  admin = 1 << 2,
}
