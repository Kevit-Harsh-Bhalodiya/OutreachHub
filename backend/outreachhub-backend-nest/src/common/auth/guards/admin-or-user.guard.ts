import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminOrUserGuard implements CanActivate {
  constructor(
    private adminService: AdminService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user?.adminId) {
      const admin = await this.adminService.findAdminById(user.adminId);
      if (!admin) {
        return false;
      }
      return true;
    }
    if (user?.userId) {
      const dbUser = await this.userService.getUserById(user.userId);
      if (!dbUser) {
        return false;
      }
      return true;
    }
    return false;
  }
}
