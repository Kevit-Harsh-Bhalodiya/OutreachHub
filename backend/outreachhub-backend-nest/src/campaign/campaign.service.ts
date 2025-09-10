import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Campaign } from './campaign.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ContactService } from 'src/contact/contact.service';
import { CampaignDto } from './campaign.dto';
import { CampaignMessageService } from 'src/campaign-message/campaign-message.service';
import { MessageTemplateService } from 'src/message-template/message-template.service';
import { CampaignMessage } from 'src/campaign-message/campaign-message.schema';
import { UserService } from 'src/user/user.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    private contactService: ContactService,
    private campaignMessageService: CampaignMessageService,
    private messageTemplateService: MessageTemplateService,
    private userService: UserService,
  ) { }
  async getAllCampaignsAdmin(): Promise<Campaign[]> {
    const campaigns = await this.campaignModel.find().lean().exec();
    if (!campaigns) {
      throw new Error('No campaigns found');
    }
    return campaigns;
  }
  async getAllCampaigns(userId: string): Promise<Campaign[]> {
    const workspaceId = (
      await this.userService.getUserById(userId)
    ).currentWorkspace.toString();
    const campaigns = await this.campaignModel
      .find({ workspaceId, isDeleted: false })
      .populate('creator', 'name')
      .lean()
      .exec();
    if (!campaigns) {
      throw new Error('No campaigns found');
    }
    return campaigns;
  }
  async getCampaignById(campaignId: string): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findById(campaignId)
      .lean()
      .exec();
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return campaign;
  }
  async getAllCampaignsByUserId(userId: string): Promise<Campaign[]> {
    const campaigns = await this.campaignModel
      .find({ creator: userId })
      .lean()
      .exec();
    if (!campaigns || campaigns.length === 0) {
      throw new Error('No campaigns found for this user');
    }
    return campaigns;
  }
  async getAllCampaignStatus(): Promise<any[]> {
    const statuses = await this.campaignModel
      .find({}, { _id: 1, status: 1, name: 1 })
      .lean()
      .exec();
    if (!statuses) {
      throw new Error('No campaign statuses found');
    }
    return statuses;
  }
  async getContactsByCampaignTag(campaignId: string): Promise<any[]> {
    const campaign = await this.campaignModel
      .findById(campaignId)
      .lean()
      .exec();
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    const contacts = await this.contactService.filterContactsByTags(
      campaign.workspaceId.toString(),
      campaign.tags,
    );
    if (!contacts) {
      throw new Error('No contacts found for this campaign');
    }
    return contacts;
  }
  async createCampaign(
    userId: string,
    campaignData: CampaignDto,
  ): Promise<Campaign> {
    const workspaceId = (
      await this.userService.getUserById(userId)
    ).currentWorkspace.toString();
    const newCampaign = new this.campaignModel({
      ...campaignData,
      workspaceId,
      creator: userId,
    });
    return await newCampaign.save();
  }
  async updateCampaign(
    campaignId: string,
    userId: string,
    campaignData: CampaignDto,
  ): Promise<Campaign> {
    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(
        campaignId,
        { ...campaignData, lastModifiedBy: userId },
        { new: true },
      )
      .lean()
      .exec();
    if (!updatedCampaign) {
      throw new Error('Campaign not found');
    }
    return updatedCampaign;
  }
  async removeCampaign(campaignId: string): Promise<Campaign> {
    const deletedCampaign = await this.campaignModel
      .findOneAndUpdate(
        { _id: campaignId, isDeleted: false },
        { isDeleted: true },
        { new: true },
      )
      .lean()
      .exec();
    if (!deletedCampaign) {
      throw new HttpException('Campaign not found', 404);
    }
    return deletedCampaign;
  }
  async changeStatus(campaignId: string, userId: string): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findOne({
        _id: campaignId,
        status: { $ne: 'Completed' },
        isDeleted: false,
      })
      .lean()
      .exec();
    if (!campaign) {
      throw new HttpException('Campaign not found', 404);
    }
    const newStatus = campaign.status === 'Draft' ? 'Running' : 'Completed';
    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(
        campaignId,
        { status: newStatus, lastModifiedBy: userId },
        { new: true },
      )
      .lean()
      .exec();
    if (!updatedCampaign) {
      throw new HttpException('Campaign not found', 404);
    }
    return updatedCampaign;
  }
  async launchCampaign(
    campaignId: string,
    userId: string,
  ): Promise<CampaignMessage[]> {
    const campaign = await this.campaignModel
      .findOne({
        _id: campaignId,
        status: 'Draft',
        isDeleted: false,
      })
      .lean()
      .exec();
    if (!campaign) {
      throw new HttpException('Campaign not found or not in Draft status', 404);
    }
    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(
        campaignId,
        { status: 'Running', lastModifiedBy: userId },
        { new: true },
      )
      .lean()
      .exec();
    if (!updatedCampaign) {
      throw new HttpException('Campaign not found', 404);
    }
    const contacts = await this.getContactsByCampaignTag(campaignId);
    const template = await this.messageTemplateService.getMessageTemplateById(
      updatedCampaign.templateId.toString(),
    );
    const campaignMessages = contacts.map((contact) => ({
      campaignId: updatedCampaign._id,
      contactId: contact._id,
      template: {
        title: template.title,
        templateImage: template.templateImage,
        body: template.body,
      },
      isDeleted: false,
    }));
    const createdData =
      await this.campaignMessageService.createCampaignMessages(
        campaignMessages,
      );
    if (!createdData) {
      throw new HttpException(
        'Failed to create campaign messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return createdData;
  }
  async getAllCampaignsAccToWorkspace(
    workspacesId: string[],
  ): Promise<Campaign[]> {
    const campaigns = await this.campaignModel
      .find({ workspaceId: { $in: workspacesId } }, { workspaceId: 1, _id: 1 })
      .lean()
      .exec();
    if (!campaigns) {
      throw new Error('No campaigns found for the given workspaces');
    }
    return campaigns;
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoLaunchCampaign() {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));

    // Query only campaigns starting today
    const campaignsForToday = await this.campaignModel.find({
      status: 'Draft',
      isDeleted: false,
      startDate: { $gte: todayStart, $lte: todayEnd },
    });
    if (campaignsForToday.length !== 0) {
      await this.campaignModel.updateMany(
        { status: 'Draft', startDate: { $gte: todayStart, $lte: todayEnd } },
        { status: 'Running' },
      );
      for (const campaign of campaignsForToday) {
        const contacts = await this.getContactsByCampaignTag(
          campaign._id.toString(),
        );
        const template =
          await this.messageTemplateService.getMessageTemplateById(
            campaign.templateId.toString(),
          );
        const campaignMessages = contacts.map((contact) => ({
          campaignId: campaign._id,
          contactId: contact._id,
          template: {
            title: template.title,
            templateImage: template.templateImage,
            body: template.body,
          },
          isDeleted: false,
        }));
        await this.campaignMessageService.createCampaignMessages(
          campaignMessages,
        );
      }
    }
    console.log('executed autoLaunchCampaign at', new Date().toISOString());
  }
}
