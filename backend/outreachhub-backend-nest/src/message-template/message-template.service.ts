import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageTemplate } from './message-template.schema';
import { MessageTemplateDto } from './message-template.dto';

@Injectable()
export class MessageTemplateService {
  constructor(
    @InjectModel(MessageTemplate.name)
    private messageTemplateModel: Model<MessageTemplate>,
  ) {}
  async getAllMessageTemplates(
    workspaceId: string,
  ): Promise<MessageTemplate[]> {
    return await this.messageTemplateModel
      .find({ workspaceId, isDeleted: false })
      .lean()
      .exec();
  }
  async getMessageTemplateById(teplateId: string): Promise<any> {
    const template = await this.messageTemplateModel
      .findOne({ _id: teplateId, isDeleted: false })
      .lean()
      .exec();
    if (!template) {
      throw new Error('Message template not found');
    }
    return template;
  }
  async createMessageTemplate(templateData: MessageTemplateDto): Promise<any> {
    const newTemplate = new this.messageTemplateModel(templateData);
    await newTemplate.save();
    if (!newTemplate) {
      throw new Error('Failed to create message template');
    }
    return newTemplate.toObject();
  }
  async updateMessageTemplate(
    templateId: string,
    updatedData: MessageTemplateDto,
  ): Promise<MessageTemplate> {
    const updatedTemplate = await this.messageTemplateModel.findOneAndUpdate(
      { _id: templateId, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (!updatedTemplate) {
      throw new Error('Message template not found or already deleted');
    }
    const { _id, ...data } = updatedTemplate.toObject();
    const newTemplate = await this.messageTemplateModel.create({
      ...data,
      ...updatedData,
      isDeleted: false,
    });
    if (!newTemplate) {
      throw new Error('Message template not found or already deleted');
    }
    return updatedTemplate.toObject();
  }
  async deleteMessageTemplate(templateId: string): Promise<any> {
    const deletedTemplate = await this.messageTemplateModel.findOneAndUpdate(
      { _id: templateId, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );
    if (!deletedTemplate) {
      throw new Error('Message template not found or already deleted');
    }
    return {
      message: 'Message template deleted successfully',
      template: deletedTemplate.toObject(),
    };
  }
}
