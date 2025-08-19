import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CampaignMessage } from './campaign-message.schema';
import { Model } from 'mongoose';
import { MessageTemplateService } from 'src/message-template/message-template.service';

@Injectable()
export class CampaignMessageService {
  constructor(
    @InjectModel(CampaignMessage.name)
    private campaignMessage: Model<CampaignMessage>,
    private messageTemplate: MessageTemplateService,
  ) {}
  async createCampaignMessage(
    campaignId: string,
    contactId: string,
    templateId: any,
  ): Promise<any> {
    const template =
      await this.messageTemplate.getMessageTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const newCampaignMessage = {
      campaignId,
      contactId,
      template: {
        title: template.title,
        templateImage: template.templateImage,
        body: template.template,
      },
    };
    const createdCampaignMessage =
      await this.campaignMessage.create(newCampaignMessage);
    if (!createdCampaignMessage) {
      throw new Error('Failed to create campaign message');
    }
    return createdCampaignMessage.toObject();
  }
  async getCampaignMessagesByCampaignId(
    campaignId: string,
  ): Promise<CampaignMessage[]> {
    const messages = await this.campaignMessage
      .find({ campaignId })
      .lean()
      .exec();
    if (!messages) {
      throw new Error('No messages found for this campaign');
    }
    return messages;
  }
  async getCampaignMessageById(
    campaignMessageId: string,
  ): Promise<CampaignMessage> {
    const message = await this.campaignMessage
      .findById(campaignMessageId)
      .lean()
      .exec();
    if (!message) {
      throw new Error('Campaign message not found');
    }
    return message;
  }
  async deleteCampaignMessage(
    campaignMessageId: string,
  ): Promise<{ message: string; campaignMessage: CampaignMessage }> {
    const deletedMessage = await this.campaignMessage.findOneAndUpdate(
      { _id: campaignMessageId, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );
    if (!deletedMessage) {
      throw new Error('Campaign message not found or already deleted');
    }
    return {
      message: 'Campaign message deleted successfully',
      campaignMessage: deletedMessage.toObject(),
    };
  }
  async updateCampaignMessage(
    campaignMessageId: string,
    updatedData: Partial<CampaignMessage>,
  ): Promise<CampaignMessage> {
    const updatedMessage = await this.campaignMessage.findOneAndUpdate(
      { _id: campaignMessageId, isDeleted: false },
      { $set: updatedData },
      { new: true },
    );
    if (!updatedMessage) {
      throw new Error('Campaign message not found or already deleted');
    }
    return updatedMessage.toObject();
  }
  async getCampaignMessagesByContactId(
    contactId: string,
  ): Promise<CampaignMessage[]> {
    const messages = await this.campaignMessage
      .find({ contactId })
      .lean()
      .exec();
    if (!messages) {
      throw new Error('No messages found for this contact');
    }
    return messages;
  }
  async getAllCampaignMessages(): Promise<CampaignMessage[]> {
    const messages = await this.campaignMessage.find().lean().exec();
    if (!messages) {
      throw new Error('No campaign messages found');
    }
    return messages;
  }
  async createCampaignMessages(
    campaignMessages: CampaignMessage[],
  ): Promise<CampaignMessage[]> {
    if (!Array.isArray(campaignMessages) || campaignMessages.length === 0) {
      throw new Error(
        'Invalid input: campaignMessages must be a non-empty array',
      );
    }
    const createdMessages =
      await this.campaignMessage.insertMany(campaignMessages);
    if (!createdMessages || createdMessages.length === 0) {
      throw new Error('Failed to create campaign messages');
    }
    return createdMessages;
  }
}
