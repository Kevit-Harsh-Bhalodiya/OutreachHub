import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ContactInfoDto {
  @IsNotEmpty()
  @IsString()
  countryCode: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsNumber()
  phone: number;
}
