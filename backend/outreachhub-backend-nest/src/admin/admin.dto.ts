import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { ContactInfoDto } from "src/common/dtos/contact-info.dto";
import { ContactInfo } from "src/common/schema/contact-info.schema";

export class AdminDto {
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
}
