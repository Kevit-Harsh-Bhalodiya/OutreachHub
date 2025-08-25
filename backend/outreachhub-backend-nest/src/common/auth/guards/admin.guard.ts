import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private adminService: AdminService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const adminId = user?.adminId;
    if (!adminId) {
      throw new UnauthorizedException('Admin credentials not found.');
    }

    try {
      const admin = await this.adminService.findAdminById(adminId);

      if (admin) {
        return true;
      }
    } catch (error) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action.',
      );
    }

    throw new UnauthorizedException(
      'You are not authorized to perform this action.',
    );
  }
}
