import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ContactInfo, ContactInfoSchema } from 'src/common/contact.schema';

export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;
  @Prop({ required: true, type: String })
  name: string;
  @Prop({ required: true, type: String })
  password: string;
  @Prop({ required: true, type: ContactInfoSchema })
  contactInfo: ContactInfo;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Workspace' })
  workspaces: mongoose.Types.ObjectId[];
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
