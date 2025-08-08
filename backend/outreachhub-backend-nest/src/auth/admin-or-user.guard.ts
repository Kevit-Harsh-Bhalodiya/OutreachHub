import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { AdminGuard } from './admin/admin.guard';
import { UserGuard } from './user/user.guard';

@Injectable()
export class AdminOrUserGuard implements CanActivate {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const adminGuard = this.moduleRef.get(AdminGuard, { strict: false });
    const userGuard = this.moduleRef.get(UserGuard, { strict: false });

    let adminPassed = false;
    let userPassed = false;

    try {
      adminPassed = await adminGuard.canActivate(context);
    } catch (err) {
      adminPassed = false;
    }

    try {
      userPassed = await userGuard.canActivate(context);
    } catch (err) {
      userPassed = false;
    }

    if (adminPassed || userPassed) {
      return true;
    }

    throw new HttpException(
      'Unauthorized: both Admin and User access denied',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
