import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class MessageTemplate {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspaceId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, enum: ['text', 'text-image'], default: 'text' })
  type: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({
    type: String,
    default: 'https://www.w3schools.com/howto/img_avatar.png',
  })
  templateImage: string;
  @Prop({ type: String, required: true })
  template: string;

  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;
}
export const MessageTemplateSchema =
  SchemaFactory.createForClass(MessageTemplate);
