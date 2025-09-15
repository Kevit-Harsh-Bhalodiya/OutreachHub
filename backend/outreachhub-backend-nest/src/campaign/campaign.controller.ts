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
import { CampaignService } from './campaign.service';
import { CampaignDto } from './campaign.dto';
import { AuthGuard } from 'src/common/auth/guards/auth.guard';
import { AdminOrUserGuard } from 'src/common/auth/guards/admin-or-user.guard';
import { WriteGuard } from 'src/common/auth/guards/write.guard';
import { UserGuard } from 'src/common/auth/guards/user.guard';
import { AdminGuard } from 'src/common/auth/guards/admin.guard';

@Controller('campaign')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}
  @Get('admin')
  @UseGuards(AuthGuard, AdminGuard)
  getAllCampaignsAdmin() {
    return this.campaignService.getAllCampaignsAdmin();
  }
  @Get()
  @UseGuards(AuthGuard, UserGuard)
  getAllCampaigns(@Req() req: any) {
    return this.campaignService.getAllCampaigns(req.user.userId);
  }
  @Get('user')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  getAllCampaignsByUserId(@Req() req: any, @Body() body: any) {
    return this.campaignService.getAllCampaignsByUserId(
      req.user.userId || body.userId,
    );
  }
  @Get('status')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  getAllCampaignStatus() {
    return this.campaignService.getAllCampaignStatus();
  }
  
  @Get(':campaignId/contacts')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  getContactsByCampaignTag(@Param('campaignId') campaignId: string) {
    return this.campaignService.getContactsByCampaignTag(campaignId);
  }
  @Get(':campaignId')
  @UseGuards(AuthGuard, AdminOrUserGuard)
  getCampaignById(@Param('campaignId') campaignId: string) {
    return this.campaignService.getCampaignById(campaignId);
  }
  @Post()
  @UseGuards(AuthGuard, UserGuard, WriteGuard)
  createCampaign(@Req() req: any, @Body() body: CampaignDto) {
    return this.campaignService.createCampaign(req.user.userId, body);
  }
  @Patch(':campaignId')
  @UseGuards(AuthGuard, UserGuard, WriteGuard)
  updateCampaign(
    @Param('campaignId') campaignId: string,
    @Req() req: any,
    @Body() body: CampaignDto,
  ) {
    return this.campaignService.updateCampaign(
      campaignId,
      req.user.userId,
      body,
    );
  }
  @Delete(':campaignId')
  @UseGuards(AuthGuard, AdminOrUserGuard, WriteGuard)
  removeCampaign(@Param('campaignId') campaignId: string) {
    return this.campaignService.removeCampaign(campaignId);
  }
}
