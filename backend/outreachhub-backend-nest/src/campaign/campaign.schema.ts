import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Campaign {
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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  lastModifiedBy: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessageTemplate',
    required: true,
  })
  templateId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: Date, default: Date.now })
  creationDate: Date;
  @Prop({ type: [String], default: [] })
  tags: string[];
  @Prop({
    type: String,
    enum: ['Draft', 'Running', 'Completed'],
    default: 'Draft',
  })
  status: string;
  @Prop({ type: Date, required: true })
  startDate: Date;
  @Prop({ type: Date, required: true })
  endDate: Date;
  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
