import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Token {
  @Prop({ required: true })
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  adminId?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId?: mongoose.Types.ObjectId;

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
