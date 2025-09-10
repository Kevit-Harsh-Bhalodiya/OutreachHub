import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from './contact.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) { }
  async getAllContacts(): Promise<Contact[]> {
    const contacts = await this.contactModel
      .find({ isDeleted: false })
      .lean()
      .exec();
    if (!contacts) {
      throw new Error('No contacts found');
    }
    return contacts;
  }
  async getContactById(contactId: string): Promise<any> {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }
    const contact = await this.contactModel
      .find({ _id: contactId, isDeleted: false })
      .lean()
      .exec();
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  }
  async getAllContactsByWorkspace(workspaceId: string): Promise<Contact[]> {
    if (!workspaceId) {
      throw new Error('Workspace ID is required');
    }
    return await this.contactModel
      .find({ workspaceId, isDeleted: false })
      .lean()
      .exec();
  }
  async getAllContactsByUser(userId: string): Promise<Contact[]> {
    return await this.contactModel.find({ creator: userId }).lean().exec();
  }
  async createContact(contactData: any): Promise<Contact> {
    const newContact = new this.contactModel(contactData);
    return await newContact.save();
  }
  async deleteContact(contactId: string): Promise<Contact> {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }
    const deletedContact = await this.contactModel
      .findByIdAndUpdate(
        {
          _id: contactId,
        },
        { isDeleted: true },
        { new: true },
      )
      .exec();
    if (!deletedContact) {
      throw new Error('Contact not found');
    }
    return deletedContact;
  }
  async updateContact(contactId: string, contactData: any): Promise<Contact> {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(contactId, contactData, { new: true })
      .lean()
      .exec();
    if (!updatedContact) {
      throw new Error('Contact not found');
    }
    return updatedContact;
  }
  async filterContactsByTags(
    workspaceId: string,
    tags: string[],
  ): Promise<Contact[]> {
    // const filteredContacts = await this.contactModel
    //   .find({ workspaceId, tags: { $in: tags } })
    //   .lean()
    //   .exec();
    const filteredContacts = await this.contactModel
      .find({ workspaceId, tags: tags })
      .lean()
      .exec();
    if (!filteredContacts) {
      throw new Error('No contacts found for the given tags');
    }
    return filteredContacts;
  }
}
