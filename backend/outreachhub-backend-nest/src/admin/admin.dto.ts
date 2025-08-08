import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { ContactInfo } from 'src/common/contact.schema';
import { ContactInfoDto } from 'src/common/contactInfo.dto';
export class AdminDto {
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;
}
