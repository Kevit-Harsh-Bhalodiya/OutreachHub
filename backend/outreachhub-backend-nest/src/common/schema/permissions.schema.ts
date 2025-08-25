import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false })
export class PermissionsWorkspace {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' })
  workspaceId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: Boolean, default: false })
  write?: boolean;
  @Prop({ type: Boolean, default: false })
  allowAdd?: boolean;
}
export const PermissionsWorkspaceSchema =
  SchemaFactory.createForClass(PermissionsWorkspace);
