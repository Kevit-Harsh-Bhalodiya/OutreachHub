import { IsNotEmpty, IsString } from 'class-validator';

export class AdminAuthDto {
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
