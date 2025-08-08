import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ContactInfo, ContactInfoSchema } from 'src/common/contact.schema';

@Schema()
export class Admin {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: ContactInfoSchema, required: true, unique: true })
  contactInfo: ContactInfo;
  @Prop({ type: Date, required: true, unique: true })
  createdAt: Date;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
