import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CampaignMessageService } from './campaign-message.service';
import { AuthGuard } from 'src/common/auth/guards/auth.guard';
import { UserGuard } from 'src/common/auth/guards/user.guard';
import { WriteGuard } from 'src/common/auth/guards/write.guard';
import { AdminOrUserGuard } from 'src/common/auth/guards/admin-or-user.guard';

@Controller('campaign-message')
export class CampaignMessageController {
  constructor(private campaignMessageService: CampaignMessageService) {}
  @Post('create')
  @UseGuards(AuthGuard, UserGuard, WriteGuard)
  async createCampaignMessage(@Body() body: any) {
    const { campaignId, contactId, templateId } = body;
    return await this.campaignMessageService.createCampaignMessage(
      campaignId,
      contactId,
      templateId,
    );
  }
  @Get()
  async getAllCampaignMessages() {
    return await this.campaignMessageService.getAllCampaignMessages();
  }
  @Get(':campaignId')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async getCampaignMessagesByCampaignId(
    @Param('campaignId') campaignId: string,
  ) {
    return await this.campaignMessageService.getCampaignMessagesByCampaignId(
      campaignId,
    );
  }
  @Get('message/:campaignMessageId')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async getCampaignMessageById(
    @Param('campaignMessageId') campaignMessageId: string,
  ) {
    return await this.campaignMessageService.getCampaignMessageById(
      campaignMessageId,
    );
  }
  @Get('contact/:contactId')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  async getCampaignMessagesByContactId(@Param('contactId') contactId: string) {
    return await this.campaignMessageService.getCampaignMessagesByContactId(
      contactId,
    );
  }
  @Patch(':campaignMessageId')
  @UseGuards(AuthGuard, UserGuard, WriteGuard)
  async updateCampaignMessage(
    @Param('campaignMessageId') campaignMessageId: string,
    @Body() body: any,
  ) {
    return await this.campaignMessageService.updateCampaignMessage(
      campaignMessageId,
      body,
    );
  }
  @Delete(':campaignMessageId')
  @UseGuards(AuthGuard, AdminOrUserGuard, WriteGuard)
  async deleteCampaignMessage(
    @Param('campaignMessageId') campaignMessageId: string,
  ) {
    return await this.campaignMessageService.deleteCampaignMessage(
      campaignMessageId,
    );
  }
}
