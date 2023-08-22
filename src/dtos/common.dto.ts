import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailValidationDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
