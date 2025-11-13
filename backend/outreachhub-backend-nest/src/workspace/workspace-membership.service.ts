import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { WorkspaceUser } from 'src/workspaceUser/workspaceUser.schema';

@Injectable()
export class WorkspaceMembershipService {
  constructor(
    @InjectModel(WorkspaceUser.name)
    private workspaceUser: Model<WorkspaceUser>,
    private userService: UserService,
  ) {}
  async addUserToWorkspace(
    body: any,
  ): Promise<WorkspaceUser | { message: string; error?: any }> {
    await this.userService.getUserById(body.memberId);
    console.log('a');

    const checkUserExists = await this.workspaceUser.findOne({
      workspaceId: body.workspaceId,
      userId: body.memberId,
      isDeleted: false,
    });
    console.log('b');
    if (checkUserExists) {
      throw new HttpException(
        'User already exists in this workspace',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('c');
    const response = await this.userService.addUserToWorkspace(
      body.workspaceId,
      body.permissions.write,
      body.permissions.allowAdd,
      body.memberId,
    );
    console.log('d');
    return response;
  }
  async deleteMemberFromWorkspace(
    req: any,
    memberId: string,
    workspaceId: string,
  ): Promise<{ message: string }> {
    const deletedWorkspaceUser = await this.workspaceUser
      .findOneAndUpdate(
        { workspaceId: workspaceId, userId: memberId, isDeleted: false },
        { isDeleted: true },
        { new: true },
      )
      .lean()
      .exec();
    if (!deletedWorkspaceUser) {
      throw new HttpException(
        'Member not found in workspace',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: 'Member removed from workspace successfully',
    };
  }
  async getAllWorkspaceByUserId(
    req: any,
    body: any,
  ): Promise<WorkspaceUser[] | { message: string; error: any }> {
    try {
      const user = await this.userService.getUserById(
        req.user.userId || body.userId,
      );
      const workspaces = await this.workspaceUser
        .find({
          userId: user._id,
          isDeleted: false,
        })
        .populate('workspaceId')
        .lean()
        .exec();
      if (!workspaces || workspaces.length === 0) {
        throw new HttpException('No workspaces found', HttpStatus.NOT_FOUND);
      }
      return workspaces;
    } catch (err) {
      return {
        message: 'Error while retrieving workspaces',
        error: err,
      };
    }
  }
  async checkUserRights(userId: string, workspaceId: string) {
    const membership = await this.workspaceUser
      .findOne({
        userId: userId,
        workspaceId: workspaceId,
        isDeleted: false,
      })
      .lean()
      .exec();

    if (!membership) {
      return null;
    }

    return {
      write: membership.write,
      allowAdd: membership.allowAdd,
    };
  }
  async getUsersByWorkspaceId(workspaceId: string, req: any): Promise<any> {
    const users = await this.workspaceUser
      .find({ workspaceId: workspaceId, isDeleted: false })
      .populate('userId', 'name email')
      .lean()
      .exec();
    return users;
  }
}
