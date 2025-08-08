import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { ContactInfo } from 'src/common/contact.schema';
import { ContactInfoDto } from 'src/common/contactInfo.dto';

export class UserDto {
  @Type(() => mongoose.Types.ObjectId)
  _id: mongoose.Types.ObjectId;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfo;
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;
}
