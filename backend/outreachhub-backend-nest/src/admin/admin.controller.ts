import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAuthDto } from 'src/auth/admin/adminAuth.dto';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { AdminDto } from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Post('login')
  async login(@Body() body: AdminAuthDto) {
    return await this.adminService.adminLogin(body);
  }
  @Get()
  @UseGuards(AdminGuard)
  getHello() {
    return 'Hello Admin';
  }
  @Post('createAdmin')
  @UseGuards(AdminGuard)
  async createAdmin(@Body() body: AdminDto) {
    return await this.adminService.createAdmin(body);
  }
}
