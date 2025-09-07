import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/user.roles.decorator';
import { AuthService } from 'src/modules/auth/auth.service';
import { AdminRoleType } from 'src/modules/auth/dto/admin.role.type';
import { isAuthInfo } from 'src/modules/auth/dto/auth.info';

// rename it to role guard
@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // const requiredRole = this.reflector.get<AdminRoleType[]>(
    //   ROLES_KEY,
    //   context.getHandler(),
    // );

    const requiredRole = this.reflector.getAllAndOverride<AdminRoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isAuthInfo(request?.user)) {
      return false;
    }

    if (requiredRole) {
      // const hasSufficientAdminRole =
      //   await this.authService.hasSufficientAdminRole(
      //     request.user.email,
      //     requiredRole,
      //   );

      // if (!hasSufficientAdminRole) {
      //   return false;
      // }
      return requiredRole.includes(request.user.role);
    }

    return true;
  }
}
