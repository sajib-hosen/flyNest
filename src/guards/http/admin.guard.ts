import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/modules/auth/auth.service';
import { AdminRoleType } from 'src/modules/auth/dto/admin.role.type';
import { isAuthInfo } from 'src/modules/auth/dto/auth.info';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const adminRoles = this.reflector.get<AdminRoleType[]>(
      'admin-roles',
      context.getHandler(),
    );

    if (!isAuthInfo(request?.user)) {
      return false;
    }

    if (adminRoles) {
      const hasSufficientAdminRole =
        await this.authService.hasSufficientAdminRole(
          request.user.email,
          adminRoles,
        );
      if (!hasSufficientAdminRole) {
        return false;
      }
    }

    return true;
  }
}
