import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from './workspace.schema';
import { Model } from 'mongoose';
import { Token } from 'src/common/token.schema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name)
    private readonly workspaceModel: Model<Workspace>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}
}
