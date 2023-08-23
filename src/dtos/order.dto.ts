import {
  IsArray,
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID
} from 'class-validator';
import { CartItem } from '../models/User.model';
import { Product } from '../models/Product.model';
import { Service } from '../models/Service.model';
import { OrderStatus } from '../models/Order.model';

export class InvoiceItemDto extends CartItem {
  @IsInstance(Product || Service)
  @IsNotEmpty()
  item: Product | Service;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  tax: number;

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

export class ProcessOrderDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
