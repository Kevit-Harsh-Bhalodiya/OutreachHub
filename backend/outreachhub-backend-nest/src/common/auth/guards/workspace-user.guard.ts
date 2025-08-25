import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { WorkspaceUser } from 'src/workspaceUser/workspaceUser.schema';

@Injectable()
export class WorkspaceUserGuard implements CanActivate {
  constructor(
    @InjectModel(WorkspaceUser.name)
    private workspaceUser: Model<WorkspaceUser>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check user exists in workspace
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId || request.user?.adminId;
    const workspaceId = request.params.workspaceId;
    if (!userId || !workspaceId) {
      return false;
    }
    const workspaceUser = await this.workspaceUser
      .findOne({ memberId: userId, workspaceId: workspaceId, isDeleted: false })
      .lean()
      .exec();
    if (!workspaceUser) {
      return false;
    }

    return true;
  }
}
