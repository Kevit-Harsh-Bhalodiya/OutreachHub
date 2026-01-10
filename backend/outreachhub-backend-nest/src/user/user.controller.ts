import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from 'src/common/dtos/userLogin.dto';
import { AuthService } from 'src/common/auth/auth.service';
import { AdminGuard } from 'src/common/auth/guards/admin.guard';
import { AuthGuard } from 'src/common/auth/guards/auth.guard';
import { AdminOrUserGuard } from 'src/common/auth/guards/admin-or-user.guard';
import { AllowAddGuard } from 'src/common/auth/guards/allowAdd.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('createUser')
  @UseGuards(AuthGuard, AdminGuard)
  async createUser(@Body() body: any): Promise<any> {
    try {
      const user = await this.userService.createUser(body);
      return user;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
  @Post('login')
  async login(@Body() loginDto: UserLoginDto) {
    return this.authService.loginUser(loginDto);
  }
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: any) {
    try {
      return await this.authService.logoutUser(req.user.userId);
    } catch (error) {
      throw new HttpException(
        'Failed to logout User',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
  }
  @Delete(':userId')
  @UseGuards(AuthGuard, AdminOrUserGuard, AllowAddGuard)
  async deleteUser(@Param('userId') userId: string): Promise<any> {
    try {
      const result = await this.userService.deleteUser(userId);
      return result;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get(':userId')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async getUserById(@Req() req: any, @Param('userId') userId: string) {
    try {
      const user = await this.userService.getUserById(userId);
      return user;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
