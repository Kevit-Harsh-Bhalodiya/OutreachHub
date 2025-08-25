import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CampaignDto {
  @IsNotEmpty()
  @Type(() => mongoose.Schema.Types.ObjectId)
  workspaceId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  @Type(() => mongoose.Schema.Types.ObjectId)
  creator: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  @Type(() => mongoose.Schema.Types.ObjectId)
  lastModifiedBy: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  @Type(() => mongoose.Schema.Types.ObjectId)
  templateId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString({ each: true })
  tags: string[];
  @IsNotEmpty()
  @IsString()
  status: 'Draft' | 'Running' | 'Completed';
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}
