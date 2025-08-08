import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Workspace {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  creator: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, default: '' })
  description: string;
  @Prop({ type: [String], default: [] })
  tags: string[];
  @Prop({ type: Date, default: Date.now })
  creationDate: Date;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
