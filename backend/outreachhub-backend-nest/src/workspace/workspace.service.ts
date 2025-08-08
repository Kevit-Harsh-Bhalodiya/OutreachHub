import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from './workspace.schema';
import { Model } from 'mongoose';
import { Token } from 'src/common/token.schema';
import { WorkspaceDto } from './workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name)
    private readonly workspaceModel: Model<Workspace>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}
  async getAllWorkspaces(): Promise<Workspace[]> {
    return this.workspaceModel.find().exec();
  }
  async createWorkspace(data: WorkspaceDto): Promise<Workspace> {
    const workspace = new this.workspaceModel(data);
    return workspace.save();
  }
  async updateWorkspace(data: WorkspaceDto): Promise<Workspace> {
    const workspace = await this.workspaceModel.findById(data._id);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    Object.assign(workspace, data);
    return await workspace.save();
  }
  async addTagToWorkspace(): Promise<Workspace> {
    try {
      const workspace = await this.workspaceModel.findById(data.workspaceId);
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      workspace.tags.push(data.tag);
    } catch (err) {
      throw new Error('Error adding tag to workspace');
    }
    return await workspace.save();
  }
}
