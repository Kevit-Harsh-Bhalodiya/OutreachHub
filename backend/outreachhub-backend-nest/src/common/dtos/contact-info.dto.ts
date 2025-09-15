import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ContactInfoDto {
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsNotEmpty()
  @IsNumber()
  phoneNo: number;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
