import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class WorkspaceUser {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
  })
  workspaceId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: Boolean, default: false })
  write?: boolean;
  @Prop({ type: Boolean, default: false })
  allowAdd?: boolean;
  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;
  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;
}
export const WorkspaceUserSchema = SchemaFactory.createForClass(WorkspaceUser);
