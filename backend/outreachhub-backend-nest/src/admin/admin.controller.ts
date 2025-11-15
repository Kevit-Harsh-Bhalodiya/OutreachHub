import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/common/auth/auth.service';
import { AdminLoginDto } from 'src/common/dtos/adminLogin.dto';
import { AdminDto } from './admin.dto';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/common/auth/guards/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private authService: AuthService,
    private adminService: AdminService,
  ) {}
  @Post('login')
  async login(@Body() loginDto: AdminLoginDto) {
    return await this.authService.loginAdmin(loginDto);
  }
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: any) {
    try {
      return await this.authService.logoutAdmin(req.user.adminId);
    } catch (error) {
      throw new HttpException(
        'Failed to logout Admin',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
  }
  @Post('createAdmin')
  @UseGuards(AuthGuard)
  async createAdmin(@Body() adminDto: AdminDto) {
    try {
      return await this.adminService.createAdmin(adminDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create Admin',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
  }
}
