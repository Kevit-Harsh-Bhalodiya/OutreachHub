import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class WorkspaceDto {
  @Type(() => mongoose.Schema.Types.ObjectId)
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @Type(() => mongoose.Schema.Types.ObjectId)
  creator: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @Type(() => Date)
  @IsOptional()
  creationDate?: Date;
}
