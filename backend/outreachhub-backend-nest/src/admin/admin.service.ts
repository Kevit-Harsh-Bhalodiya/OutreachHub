import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './admin.schema';
import { Model } from 'mongoose';
import { AdminDto } from './admin.dto';
import bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { CampaignService } from 'src/campaign/campaign.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private userService: UserService,
    private campaignService: CampaignService,
  ) { }
  async getAdminById(adminId: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ _id: adminId }).lean().exec();
    if (!admin) {
      throw new HttpException('Admin Not Found', HttpStatus.NOT_FOUND);
    }
    return admin;
  }
  async findByEmail(email: string): Promise<Admin> {
    const admin = await this.adminModel
      .findOne({ 'contactInfo.email': email })
      .lean()
      .exec();
    if (!admin) {
      throw new HttpException('Admin Not Found', HttpStatus.UNAUTHORIZED);
    }
    return admin;
  }
  async createAdmin(adminData: AdminDto) {
    const exists = await this.adminModel
      .findOne({ 'contactInfo.email': adminData.contactInfo.email })
      .lean()
      .exec();
    if (exists) {
      throw new HttpException(
        'Admin with this email already exists',
        HttpStatus.AMBIGUOUS,
      );
    }
    adminData.password = await bcrypt.hash(adminData.password, 10);
    const newAdmin = new this.adminModel(adminData);
    await newAdmin.save();
    return newAdmin.toObject();
  }
  async findAdminById(id: string): Promise<any> {
    const admin = await this.adminModel.findById(id).lean().exec();
    if (!admin) {
      throw new HttpException('Admin Not Found', HttpStatus.NOT_FOUND);
    }
    return admin;
  }
  async getAllUsersAccToWorkspace(workspacesId: string[]):Promise<any> {
    const users =
      await this.userService.getAllUsersAccToWorkspace(workspacesId);
    if (!users) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }
    return users;
  }
  async getAllCampaignsAccToWorkspace(workspacesId: string[]):Promise<any> {
    const campaigns =
      await this.campaignService.getAllCampaignsAccToWorkspace(workspacesId);
    if (!campaigns) {
      throw new HttpException('No campaigns found', HttpStatus.NOT_FOUND);
    }
    return campaigns;
  }
}
