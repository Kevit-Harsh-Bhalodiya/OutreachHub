import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  ContactInfo,
  ContactInfoSchema,
} from 'src/common/schema/contact-info.schema';

@Schema()
export class Admin {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: ContactInfoSchema, required: true})
  contactInfo: ContactInfo;
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
