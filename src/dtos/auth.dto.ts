import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { StrongPasswordValidator } from '../utils/customPasswordValidator';

export class SignupUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Validate(StrongPasswordValidator)
  password: string;
}

export class SigninUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @Validate(StrongPasswordValidator)
  newPassword: string;
}
