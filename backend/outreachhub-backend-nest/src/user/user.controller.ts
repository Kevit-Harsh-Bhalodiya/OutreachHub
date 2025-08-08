import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { UserGuard } from 'src/auth/user/user.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  @UseGuards(UserGuard)
  async getUserById(@Body() body: { id: string }) {
    return await this.userService.getUserById(body.id);
  }
  @Get('all')
  @UseGuards(UserGuard)
  async getAllUsers() {
    // return await this.userService.getAllUsers();
  }
  @Post('login')
  async login(@Body() body: UserDto) {
    // return await this.userService.userLogin();
  }
  @Post('signup')
  async signup() {
    // return await this.userService.userSignup();
  }
  @Post('logout')
  @UseGuards(UserGuard)
  async logout() {
    // return await this.userService.userLogout();
  }
  @Delete('deleteAccount')
  @UseGuards(UserGuard)
  async deleteAccount() {
    // return await this.userService.deleteUserAccount();
  }
  @Post('setWorkspace')
  @UseGuards(UserGuard)
  async setWorkspace() {
    // return await this.userService.setWorkspace();
  }
}
