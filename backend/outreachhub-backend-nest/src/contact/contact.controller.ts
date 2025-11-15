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
import { ContactService } from './contact.service';
import { ContactDto } from './contact.dto';
import { AuthGuard } from 'src/common/auth/guards/auth.guard';
import { AdminOrUserGuard } from 'src/common/auth/guards/admin-or-user.guard';
import { WriteGuard } from 'src/common/auth/guards/write.guard';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { UserService } from 'src/user/user.service';

@Controller('contact')
export class ContactController {
  constructor(
    private contactService: ContactService,
    private workspaceService: WorkspaceService,
    private userService: UserService,
  ) {}
  @Get()
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async getAllContactsByWorkspace(@Req() req: any, @Body() body: any) {
    const user = await this.userService.getUserById(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }
    const workspaceId = user.currentWorkspace;

    if (!workspaceId) {
      throw new Error('Workspace ID is required');
    }
    const contacts =
      await this.contactService.getAllContactsByWorkspace(workspaceId);
    if (!contacts) {
      throw new Error('No contacts found for this workspace');
    }
    return contacts;
  }
  @Get('/user')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async getAllContactsByUser(@Req() req: any) {
    const userId = req.user.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    const contacts = await this.contactService.getAllContactsByUser(userId);
    if (!contacts) {
      throw new Error('No contacts found for this user');
    }
    return contacts;
  }
  @Post()
  @UseGuards(AuthGuard, AdminOrUserGuard, WriteGuard)
  async createContact(@Req() req: any, @Body() body: ContactDto) {
    if (!body.creator && req.user) {
      body.creator = req.user.userId || req.user.adminId;
    }
    body.workspaceId = (
      await this.userService.getUserById(req.user.userId)
    ).currentWorkspace.toString();
    const contact = await this.contactService.createContact(body);
    if (!contact) {
      throw new Error('Failed to create contact');
    }
    return contact;
  }
  @Delete('/:contactId')
  @UseGuards(AuthGuard, AdminOrUserGuard, WriteGuard)
  async deleteContact(@Param('contactId') contactId: string) {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }
    const deletedContact = await this.contactService.deleteContact(contactId);
    if (!deletedContact) {
      throw new Error('Failed to delete contact');
    }
    return deletedContact;
  }
  @Patch('/:contactId')
  @UseGuards(AuthGuard, AdminOrUserGuard, WriteGuard)
  async updateContact(
    @Param('contactId') contactId: string,
    @Body() body: ContactDto,
  ) {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }
    const updatedContact = await this.contactService.updateContact(
      contactId,
      body,
    );
    if (!updatedContact) {
      throw new Error('Failed to update contact');
    }
    return updatedContact;
  }
  @Post('/filter')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async filterContactsByTags(@Req() req: any, @Body() body: any) {
    const workspaceId =
      body.workspaceId ||
      (
        await this.userService.getUserById(req.user.userId)
      ).currentWorkspace.toString();
    if (!workspaceId) {
      throw new Error('Workspace ID is required');
    }
    const workspace: any =
      await this.workspaceService.getWorkspaceById(workspaceId);
    if (workspace.error != null || workspace.error != undefined || !workspace) {
      throw new Error('Workspace not found or error retrieving workspace');
    }

    const tags = body.tags || workspace.tags;
    if (!tags || !Array.isArray(tags)) {
      throw new Error('Tags must be an array');
    }
    const filteredContacts = await this.contactService.filterContactsByTags(
      workspaceId,
      tags,
    );
    if (!filteredContacts) {
      throw new Error('No contacts found for the given tags');
    }
    return filteredContacts;
  }
}
