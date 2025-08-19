import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from './workspace.schema';
import { Model } from 'mongoose';
import { AdminService } from 'src/admin/admin.service';
import { WorkspaceDto } from './workspace.dto';
import { UserService } from 'src/user/user.service';
import { WorkspaceUser } from 'src/workspaceUser/workspaceUser.schema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
    @InjectModel(WorkspaceUser.name)
    private workspaceUserModel: Model<WorkspaceUser>,
    private userService: UserService,
    private adminService: AdminService,
  ) {}

  async getAllWorkspace(
    req: any,
  ): Promise<Workspace[] | { message: string; error: any }> {
    try {
      const workspace = await this.workspaceModel.find().lean().exec();
      return workspace;
    } catch (err) {
      return {
        message: 'Error getting admin',
        error: err,
      };
    }
  }
  async createWorkspace(
    req: any,
    body: WorkspaceDto,
  ): Promise<Workspace | { message: string; error: any }> {
    try {
      const admin = await this.adminService.findAdminById(req.user.adminId);
      const workspaceExists = await this.workspaceModel
        .findOne({ name: body.name })
        .lean()
        .exec();
      if (workspaceExists) {
        throw new HttpException(
          'Workspace with this name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const workspace = new this.workspaceModel({
        ...body,
        createdBy: admin._id,
      });
      await workspace.save();
      return workspace.toObject();
    } catch (err) {
      return {
        message: 'Error retrieving workspaces',
        error: err,
      };
    }
  }
  async getWorkspaceById(
    workspaceId: string,
  ): Promise<Workspace | { message: string; error: any }> {
    const workspace = await this.workspaceModel
      .findById(workspaceId)
      .lean()
      .exec();
    if (!workspace) {
      throw new HttpException('Workspace Not Found', HttpStatus.NOT_FOUND);
    }
    return workspace;
  }
  async addTagToWorkspace(
    body: any,
  ): Promise<Workspace | { message: string; error: any }> {
    const workspaceId = body.workspaceId;
    const tags = body.tags;
    const workspace = await this.getWorkspaceById(workspaceId);
    if (!workspace) {
      throw new HttpException('Workspace Not Found', HttpStatus.NOT_FOUND);
    }
    const updatedWorkspace = await this.workspaceModel
      .findByIdAndUpdate(
        workspaceId,
        { $addToSet: { tags: { $each: tags } } },
        { new: true },
      )
      .lean()
      .exec();
    if (!updatedWorkspace) {
      throw new HttpException(
        'Error updating workspace with tags',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updatedWorkspace;
  }
  async updateWorkspace(
    req: any,
    body: any,
  ): Promise<Workspace | { message: string; error: any }> {
    try {
      const workspaceId = body.workspaceId;
      const updateData = body.updateData;
      const workspace = await this.getWorkspaceById(workspaceId);
      if (!workspace) {
        throw new HttpException('Workspace Not Found', HttpStatus.NOT_FOUND);
      }
      const updatedWorkspace = await this.workspaceModel
        .findByIdAndUpdate(workspaceId, { $set: updateData }, { new: true })
        .lean()
        .exec();
      if (!updatedWorkspace) {
        throw new HttpException(
          'Error updating workspace',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return updatedWorkspace;
    } catch (err) {
      return {
        message: 'Error updating workspace',
        error: err,
      };
    }
  }
  async deleteWorkspace(
    req: any,
    workspaceId: string,
  ): Promise<{ message: string }> {
    try {
      const workspace = await this.getWorkspaceById(workspaceId);
      if (!workspace) {
        throw new HttpException('Workspace Not Found', HttpStatus.NOT_FOUND);
      }
      const userWorkspaces = await this.workspaceUserModel.updateMany(
        {
          workspaceId: workspaceId,
          isDeleted: false,
        },
        {
          isDeleted: true,
        },
      );
      if (!userWorkspaces) {
        throw new HttpException(
          'Error updating user workspaces',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const deletedWorkspace = await this.workspaceModel.findOneAndUpdate(
        { _id: workspaceId },
        { isDeleted: true },
        { new: true },
      );
      if (!deletedWorkspace) {
        throw new HttpException(
          'Error deleting workspace',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        message: 'Workspace deleted successfully',
      };
    } catch (err) {
      throw new HttpException(
        'Error deleting workspace',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async setCurrentWorkspace(userId: string, workspaceId: string) {
    const response = await this.userService.setCurrentWorkspace(
      workspaceId,
      userId,
    );
    return response;
  }
  async removeTagFromWorkspace(
    workspaceId: string,
    tagsToRemove: string[],
  ): Promise<any> {
    const updatedWorkspace = await this.workspaceModel.findOneAndUpdate(
      {
        _id: workspaceId,
      },
      { $pull: { tags: { $in: tagsToRemove } } },
      { new: true, runValidators: true },
    );
    if (!updatedWorkspace) {
      throw new HttpException(
        'Error removing tags from workspace',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { message: 'removed tags from workspace' };
  }
}
