import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { ContactInfoDto } from 'src/common/dtos/contact-info.dto';

export class ContactDto {
  @IsNotEmpty()
  @Type(() => mongoose.Schema.Types.ObjectId)
  workspaceId: mongoose.Schema.Types.ObjectId;
  @Type(() => mongoose.Schema.Types.ObjectId)
  creator?: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  profilePicture?: string;
  @IsNotEmpty()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
  @IsNotEmpty()
  @IsString()
  company: string;
  @IsNotEmpty()
  @IsString()
  jobTitle: string;
  @IsNotEmpty()
  @IsString({ each: true })
  tags: string[];
}
