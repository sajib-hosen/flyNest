import { SetMetadata } from '@nestjs/common';
import { AdminRoleType } from 'src/modules/auth/dto/admin.role.type';

export const Roles = (roleType: string, ...roles: AdminRoleType[]) =>
  SetMetadata(`${roleType}-roles`, roles);
