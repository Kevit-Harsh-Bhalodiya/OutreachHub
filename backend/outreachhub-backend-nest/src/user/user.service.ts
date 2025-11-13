import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { WorkspaceUser } from 'src/workspaceUser/workspaceUser.schema';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(WorkspaceUser.name)
    private workspaceUserModel: Model<WorkspaceUser>,
  ) {}

  async getUserById(userId: string): Promise<any> {
    const user = await this.userModel
      .findOne({ _id: userId, isDeleted: false })
      .lean()
      .exec();
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ 'contactInfo.email': email, isDeleted: false })
      .lean()
      .exec();
    if (!user || user.isDeleted) {
      throw new HttpException('User Not Found', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async addUserToWorkspace(
    workspaceId: string,
    write: boolean,
    allowAdd: boolean,
    userId: string,
  ): Promise<WorkspaceUser | { message: string; error: any }> {
    try {
      const user = await this.getUserById(userId);
      console.log(user)
      if (!user || user.isDeleted) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }
      const newEntry = await this.workspaceUserModel.create({
        workspaceId: workspaceId,
        userId: userId,
        write: write,
        allowAdd: allowAdd,
      });
      if (!newEntry) {
        throw new Error('Failed to create workspace user entry');
      }
      return newEntry.toObject();
    } catch (err) {
      return {
        message: 'Error adding user to workspace',
        error: err,
      };
    }
  }
  async createUser(userData: any): Promise<any> {
    const exists = await this.userModel.findOne({
      'contactInfo.email': userData.contactInfo.email,
      isDeleted: false,
    });
    if (exists) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }
    userData.password = await bcrypt.hash(userData.password, 10);
    const user = await this.userModel.create(userData);
    if (!user) {
      throw new Error('User Creation Failed');
    }
    return user.toObject();
  }
  async setCurrentWorkspace(workspaceId: string, userId: string) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { currentWorkspace: workspaceId },
        { new: true },
      )
      .lean()
      .exec();
    if (!updatedUser) {
      throw new Error('Failed to update user with current workspace');
    }
    return {
      message: 'Current workspace set successfully',
    };
  }
  async deleteUser(userId: string): Promise<any> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { isDeleted: true }, { new: true })
      .lean()
      .exec();
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'User deleted successfully',
    };
  }
}
