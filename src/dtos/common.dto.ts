import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class EmailValidationDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class UUIDValidationDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
