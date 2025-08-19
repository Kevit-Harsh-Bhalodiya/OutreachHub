import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { UserService } from 'src/user/user.service';
import { WorkspaceMembershipService } from 'src/workspace/workspace-membership.service';

@Injectable()
export class WriteGuard implements CanActivate {
  // This guard only needs the membership service
  constructor(
    private membershipService: WorkspaceMembershipService,
    private userService: UserService,
    private adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.user.userId) {
      const user = await this.userService.getUserById(request.user.userId);
      if (!user) {
        throw new ForbiddenException('User not found.');
      }
      const workspaceId = user.currentWorkspace.toString();
      const membership = await this.membershipService.checkUserRights(
        user._id,
        workspaceId,
      );
      if (!membership) {
        throw new ForbiddenException('You are not a member of this workspace.');
      }
      if (!membership.write) {
        throw new ForbiddenException(
          'You do not have write permissions for this workspace.',
        );
      }
      return true;
    } else if (request.user.adminId) {
      const admin = await this.adminService.findAdminById(request.user.adminId);
      if (!admin) {
        throw new ForbiddenException('Admin not found.');
      }
      return true;
    }

    // The logic is hardcoded here. This guard ONLY checks for 'write' permission.

    return false;
  }
}
