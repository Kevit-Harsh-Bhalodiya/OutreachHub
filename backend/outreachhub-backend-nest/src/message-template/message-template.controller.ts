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
import { MessageTemplateService } from './message-template.service';
import { AuthGuard } from 'src/common/auth/guards/auth.guard';
import { AdminOrUserGuard } from 'src/common/auth/guards/admin-or-user.guard';
import { WriteGuard } from 'src/common/auth/guards/write.guard';
import { UserService } from 'src/user/user.service';
import { UserGuard } from 'src/common/auth/guards/user.guard';

@Controller('message-template')
export class MessageTemplateController {
  constructor(
    private messageTemplateService: MessageTemplateService,
    private userService: UserService,
  ) {}
  @Get()
  @UseGuards(AuthGuard, UserGuard)
  async getAllMessageTemplates(@Req() req: any) {
    const user = await this.userService.getUserById(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }
    const workspaceId = user.currentWorkspace;

    if (!workspaceId) {
      throw new Error('Workspace ID is required');
    }
    const messageTemplates =
      await this.messageTemplateService.getAllMessageTemplates(workspaceId);
    return messageTemplates;
  }
  @Get('/:messageTemplateId')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async getMessageTemplateById(
    @Param('messageTemplateId') messageTemplateId: string,
  ) {
    const messageTemplate =
      await this.messageTemplateService.getMessageTemplateById(
        messageTemplateId,
      );
    return messageTemplate;
  }
  @Post('/')
  @UseGuards(AuthGuard, AdminOrUserGuard, WriteGuard)
  async createMessageTemplate(@Req() req: any, @Body() body: any) {
    const workspaceId =
      body.workspaceId ||
      (
        await this.userService.getUserById(req.user.userId)
      ).currentWorkspace.toString();
    const messageTemplate =
      await this.messageTemplateService.createMessageTemplate({
        ...body,
        workspaceId,
      });
    return messageTemplate;
  }
  @Patch('/:messageTemplateId')
  @UseGuards(AuthGuard, AdminOrUserGuard, WriteGuard)
  async updateMessageTemplate(
    @Param('messageTemplateId') messageTemplateId: string,
    @Body() body: any,
  ) {
    const messageTemplate =
      await this.messageTemplateService.updateMessageTemplate(
        messageTemplateId,
        body,
      );
    return messageTemplate;
  }
  @Delete('/:messageTemplateId')
  @UseGuards(AuthGuard, AdminOrUserGuard, WriteGuard)
  async deleteMessageTemplate(
    @Param('messageTemplateId') messageTemplateId: string,
  ) {
    console.log('Deleting message template:', messageTemplateId);
    const messageTemplate =
      await this.messageTemplateService.deleteMessageTemplate(
        messageTemplateId,
      );
    return messageTemplate;
  }
}
