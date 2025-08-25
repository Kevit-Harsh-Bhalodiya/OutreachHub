import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class MessageTemplateDto {
  @IsNotEmpty()
  @Type(() => mongoose.Schema.Types.ObjectId)
  workspaceId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  @IsString()
  type: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsString()
  templateImage?: string;
  @IsString()
  template: string;
}
