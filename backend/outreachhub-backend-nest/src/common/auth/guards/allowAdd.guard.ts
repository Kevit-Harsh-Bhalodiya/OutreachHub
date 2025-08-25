import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { WorkspaceMembershipService } from 'src/workspace/workspace-membership.service';

@Injectable()
export class AllowAddGuard implements CanActivate {
  // This guard also only needs the membership service
  constructor(private membershipService: WorkspaceMembershipService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const workspaceId = request.user.workspaceId;
    if (user.userId) {
      const member = await this.membershipService.checkUserRights(
        user.userId,
        workspaceId,
      );

      if (!member) {
        throw new ForbiddenException('You are not a member of this workspace.');
      }

      if (!member.allowAdd) {
        throw new ForbiddenException(
          'You do not have permission to manage members in this workspace.',
        );
      }

      return true;
    } else if (user.adminId) {
      return true;
    }
    return false;
  }
}
