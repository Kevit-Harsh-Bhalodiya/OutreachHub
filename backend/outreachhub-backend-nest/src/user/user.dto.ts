import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';
import { ContactInfoDto } from 'src/common/dtos/contact-info.dto';
import { ContactInfo } from 'src/common/schema/contact-info.schema';

export class UserDto {
  @Type(() => mongoose.Schema.Types.ObjectId)
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfo;

  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsArray()
  @Type(() => mongoose.Schema.Types.ObjectId)
  workspaces?: mongoose.Schema.Types.ObjectId[];
}
