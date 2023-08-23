import {
  IsArray,
  IsInstance,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';
import { CartItem } from '../models/User.model';
import { Product } from '../models/Product.model';
import { Service } from '../models/Service.model';

export class InvoiceItemDto extends CartItem {
  @IsInstance(Product || Service)
  @IsNotEmpty()
  item: Product | Service;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  tax: number;

  @IsInstance(Product)
  @IsOptional()
  product?: Product;

  @IsInstance(Service)
  @IsOptional()
  service?: Service;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  taxCategories: string[];

  @IsObject({
    each: true
  })
  @IsNotEmpty()
  taxBreakdown: {
    [key: string]: number;
  };
}
