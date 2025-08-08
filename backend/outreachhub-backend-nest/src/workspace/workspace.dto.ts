import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class WorkspaceDto {
  @Type(() => mongoose.Schema.Types.ObjectId)
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  @IsString()
  creator: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  tags: string[];
  @IsNotEmpty()
  @IsDate()
  creationDate: Date;
}
