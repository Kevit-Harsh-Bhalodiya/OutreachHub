import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/auth/guards/auth.guard';
import { WorkspaceService } from './workspace.service';
import { WorkspaceMembershipService } from './workspace-membership.service';
import { AllowAddGuard } from 'src/common/auth/guards/allowAdd.guard';
import { AdminGuard } from 'src/common/auth/guards/admin.guard';
import { UserGuard } from 'src/common/auth/guards/user.guard';
import { AdminOrUserGuard } from 'src/common/auth/guards/admin-or-user.guard';
import { WriteGuard } from 'src/common/auth/guards/write.guard';

@Controller('workspace')
export class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService,
    private workspaceMembershipService: WorkspaceMembershipService,
  ) {}
  @Get('/getUsers/:workspaceId') //done
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async getUsersByWorkspaceId(
    @Param('workspaceId') workspaceId: string,
    @Req() req: any,
  ) {
    const users = await this.workspaceMembershipService.getUsersByWorkspaceId(
      workspaceId,
      req,
    );
    return users;
  }
  @Get('/admin')
  @UseGuards(AuthGuard, AdminGuard)
  async getAllWorkspaces(@Req() req: any) {
    const workspaces = await this.workspaceService.getAllWorkspace(req);
    return workspaces;
  }

  @Get('/user')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async getAllWorkspacesByUserId(@Req() req: any, @Body() body: any) {
    const workspaces =
      await this.workspaceMembershipService.getAllWorkspaceByUserId(req, body);
    return workspaces;
  }
  @Get('/:workspaceId') //done
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async getWorkspaceById(@Req() req: any) {
    const workspace = await this.workspaceService.getWorkspaceById(
      req.params.workspaceId,
    );
    return workspace;
  }
  @Post('/create')
  @UseGuards(AuthGuard, AdminGuard)
  async createWorkspace(@Req() req: any, @Body() body: any) {
    const workspace = await this.workspaceService.createWorkspace(req, body);
    return workspace;
  }

  @Post('/addMember')
  @UseGuards(AuthGuard, AdminOrUserGuard, WriteGuard)
  async addUserToWorkspace(@Body() body: any) {
    const workspace =
      await this.workspaceMembershipService.addUserToWorkspace(body);
    return workspace;
  }

  @Post('/addTags')
  @UseGuards(AuthGuard, AdminGuard)
  async addTagToWorkspace(@Body() body: any) {
    const updatedWorkspace =
      await this.workspaceService.addTagToWorkspace(body);
    return updatedWorkspace;
  }

  @Patch('/updateWorkspace')
  @UseGuards(AuthGuard, AdminGuard)
  async updateWorkspace(@Req() req: any, @Body() body: any) {
    const updatedWorkspace = await this.workspaceService.updateWorkspace(
      req,
      body,
    );
    return updatedWorkspace;
  }

  @Delete('/deleteMember')
  @UseGuards(AuthGuard, AllowAddGuard)
  async deleteMemberFromWorkspace(@Req() req: any, @Body() body: any) {
    const updatedWorkspace =
      await this.workspaceMembershipService.deleteMemberFromWorkspace(
        req,
        body.memberId,
        body.workspaceId,
      );
    return updatedWorkspace;
  }

  @Delete('/delete')
  @UseGuards(AuthGuard, AdminGuard)
  async deleteWorkspace(@Req() req: any, @Body() body: any) {
    const deletedWorkspace = await this.workspaceService.deleteWorkspace(
      req,
      body.workspaceId,
    );
    return deletedWorkspace;
  }

  @Delete('/removeTags')
  @UseGuards(AuthGuard, AdminGuard)
  async removeTagFromWorkspace(@Req() req: any, @Body() body: any) {
    const res = await this.workspaceService.removeTagFromWorkspace(
      body.workspaceId,
      body.tags,
    );
    return res;
  }

  @Post('/setCurrentWorkspace')
  @UseGuards(AuthGuard, UserGuard)
  async setCurrentWorkspace(
    @Req() req: any,
    @Body() body: { workspaceId: string },
  ) {
    const response = await this.workspaceService.setCurrentWorkspace(
      req.user.userId,
      body.workspaceId,
    );
    return response;
  }
}
