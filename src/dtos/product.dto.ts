import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  description: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  image: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  description: string;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  image: string;
}
