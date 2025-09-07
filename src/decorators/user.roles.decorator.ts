import { SetMetadata } from '@nestjs/common';
import { AdminRoleType } from 'src/modules/auth/dto/admin.role.type';

export const ROLES_KEY = 'roles';

export const Roles = (roleType: string, ...roles: AdminRoleType[]) =>
  SetMetadata(ROLES_KEY, roles);
