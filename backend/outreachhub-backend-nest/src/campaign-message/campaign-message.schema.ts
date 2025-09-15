import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false })
class Template {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String })
  templateImage?: string;
  @Prop({ type: [String], required: true })
  body: string[];
}
const TemplateSchema = SchemaFactory.createForClass(Template);

@Schema()
export class CampaignMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  campaignId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  contactId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: TemplateSchema, required: true })
  template: Template;
  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;
}

export const CampaignMessageSchema =
  SchemaFactory.createForClass(CampaignMessage);
