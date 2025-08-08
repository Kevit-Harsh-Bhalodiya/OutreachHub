import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceDto } from './workspace.dto';
import { UserDto } from 'src/user/user.dto';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { UserGuard } from 'src/auth/user/user.guard';
import { AdminOrUserGuard } from 'src/auth/admin-or-user.guard';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Get('admin')
  @UseGuards(AdminGuard)
  async getAllWorkspaces() {}

  @Post('create')
  @UseGuards(AdminGuard)
  async createWorkspace(@Body() data: WorkspaceDto) {}

  @Patch('updateWorkspace')
  @UseGuards(AdminGuard)
  async updateWorkspace(@Body() data: WorkspaceDto) {}

  @Post('addTags')
  @UseGuards(AdminGuard)
  async addTagToWorkspace(data: any) {}

  @Delete('removeTags')
  @UseGuards(AdminGuard)
  async removeTagFromWorkspace(data: any) {}

  @Get('user')
  @UseGuards(UserGuard)
  async getAllWorkspacesByUserId() {}

  @Post('addMember')
  @UseGuards(AdminOrUserGuard)
  async addMemberToWorkspace(@Body() data: UserDto) {}

  @Delete('deleteMember')
  @UseGuards(AdminOrUserGuard)
  async deleteMemberFromWorkspace(@Body() data: { memberId: string }) {}

  @Delete('delete')
  @UseGuards(AdminGuard)
  async deleteWorkspace(@Body() workspace: string) {}

  @Get('/')
  @UseGuards(AdminOrUserGuard)
  async getWorkspaceById() {}
}
