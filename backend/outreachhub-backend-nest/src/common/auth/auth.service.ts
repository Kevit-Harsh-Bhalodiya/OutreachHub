import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import bcrypt from 'bcryptjs';
import { Admin } from 'src/admin/admin.schema';
import { Token } from '../schema/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AdminLoginDto } from '../dtos/adminLogin.dto';
import { UserService } from 'src/user/user.service';
import { UserLoginDto } from '../dtos/userLogin.dto';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private jwtService: JwtService,
    private adminService: AdminService,
    private userService: UserService,
  ) {}
  async loginAdmin(adminData: AdminLoginDto): Promise<object> {
    const { email, password } = adminData;
    let token: string = '';
    const admin: Admin = await this.adminService.findByEmail(email);
    if (!admin || !admin.password) {
      throw new HttpException('Auth Failed', HttpStatus.UNAUTHORIZED);
    }

    if (await bcrypt.compare(password, admin.password)) {
      const existingToken = await this.tokenModel.findOne({
        adminId: admin._id,
      });
      if (existingToken) {
        throw new HttpException(
          'Admin already logged in',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const payload = {
        email: admin.contactInfo.email,
        adminId: admin._id,
        isAdmin: true,
      };
      token = this.jwtService.sign(payload, { expiresIn: '1h' });
      const newToken = {
        token: token,
        adminId: admin._id,
      };

      const createdToken = await this.tokenModel.create(newToken);
      if (!createdToken) {
        throw new HttpException(
          'Token Creation Failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (!payload) {
        throw new HttpException('Auth Failed', HttpStatus.UNAUTHORIZED);
      }
      return {
        token,
        message: 'Auth Successful',
      };
    }
    throw new HttpException('Auth Failed', HttpStatus.UNAUTHORIZED);
  }
  async logoutAdmin(adminId: string): Promise<object> {
    const admin = await this.adminService.findAdminById(adminId);
    if (!admin) {
      throw new HttpException('Admin Not Found', HttpStatus.NOT_FOUND);
    }
    const existingToken = await this.tokenModel.findOne({
      adminId: admin._id,
    });
    if (!existingToken) {
      throw new HttpException('No active session found', HttpStatus.NOT_FOUND);
    }
    const deleted = await this.tokenModel.deleteOne({
      _id: existingToken._id,
    });
    if (deleted.deletedCount === 0) {
      throw new HttpException(
        'Logout Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { message: 'Logout Successful' };
  }
  async loginUser(userData: UserLoginDto): Promise<object> {
    const { email, password } = userData;
    let token: string = '';
    const user: User = await this.userService.findByEmail(email);
    if (!user || !user.password) {
      throw new HttpException('Auth Failed', HttpStatus.UNAUTHORIZED);
    }
    if (await bcrypt.compare(password, user.password)) {
      const existingToken = await this.tokenModel.findOne({
        userId: user._id,
      });
      if (existingToken) {
        throw new HttpException(
          'User already logged in',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const payload = {
        email: user.contactInfo.email,
        userId: user._id,
        isAdmin: false,
      };
      token = this.jwtService.sign(payload, { expiresIn: '1h' });
      const newToken = {
        token: token,
        userId: user._id,
      };
      const createdToken = await this.tokenModel.create(newToken);
      if (!createdToken) {
        throw new HttpException(
          'Token Creation Failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (!payload) {
        throw new HttpException('Auth Failed', HttpStatus.UNAUTHORIZED);
      }
      return {
        token,
        message: 'Auth Successful',
      };
    }
    throw new HttpException('Auth Failed', HttpStatus.UNAUTHORIZED);
  }
  async logoutUser(userId: string): Promise<object> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const existingToken = await this.tokenModel.findOne({
      userId: user._id,
    });
    if (!existingToken) {
      throw new HttpException('No active session found', HttpStatus.NOT_FOUND);
    }
    const deleted = await this.tokenModel.deleteOne({
      _id: existingToken._id,
    });
    if (deleted.deletedCount === 0) {
      throw new HttpException(
        'Logout Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { message: 'Logout Successful' };
  }
}
