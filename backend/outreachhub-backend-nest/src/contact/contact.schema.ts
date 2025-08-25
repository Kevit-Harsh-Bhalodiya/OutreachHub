import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  ContactInfo,
  ContactInfoSchema,
} from 'src/common/schema/contact-info.schema';

@Schema()
export class Contact {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspaceId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({
    type: String,
    default: 'https://www.w3schools.com/howto/img_avatar.png',
  })
  profilePicture: string;
  @Prop({ type: ContactInfoSchema, required: true })
  contactInfo: ContactInfo;
  @Prop({ type: String, required: true })
  company: string;
  @Prop({ type: String, required: true })
  jobTitle: string;
  @Prop({ type: [String], default: [] })
  tags: string[];
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
