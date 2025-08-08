import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './admin.schema';
import { Model } from 'mongoose';
import { AdminAuthDto } from 'src/auth/admin/adminAuth.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AdminDto } from './admin.dto';
import { Token } from 'src/common/token.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private jwtService: JwtService,
  ) {}
  async getAdminByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ 'contactInfo.email': email }).exec();
  }
  async adminLogin(data: AdminAuthDto): Promise<any> {
    const admin = await this.getAdminByEmail(data.email);
    if (!admin) {
      return { error: 'Admin not found' };
    }
    if (await bcrypt.compare(data.password, admin.password)) {
      const token = await this.jwtService.signAsync(
        {
          adminId: admin._id,
          email: admin.contactInfo.email,
        },
        { expiresIn: '1h' },
      );
      // Save the token in the database
      const newToken = new this.tokenModel({
        token: token,
        adminId: admin._id,
      });
      await newToken.save();
      return {
        message: 'Login successful',
        token: token,
      };
    }
    return { error: 'Login failed' };
  }
  async adminLogout(token: string): Promise<any> {
    const tokenExists = await this.tokenModel.find({ token: token });
    if (tokenExists.length > 0) {
      await this.tokenModel.deleteOne({ token: token });
    } else {
      return { message: 'Token not found' };
    }
    return { message: 'Logout successful' };
  }
  async createAdmin(data: AdminDto) {
    const existingAdmin = await this.getAdminByEmail(data.contactInfo.email);
    if (existingAdmin) {
      return { error: 'Admin with this email already exists' };
    }
    try {
      const hashedPassword: string = await bcrypt.hash(data.password, 10);
      const newAdmin = new this.adminModel({
        name: data.name,
        password: hashedPassword,
        contactInfo: data.contactInfo,
        createdAt: new Date(),
      });
      const savedAdmin = await newAdmin.save();
      return {
        message: 'Admin created successfully',
        admin: savedAdmin,
      };
    } catch (err: any) {
      return { error: 'Error hashing password', err };
    }
  }
}
