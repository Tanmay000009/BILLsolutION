import {
  IsArray,
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { CartItem, CartItemType } from '../models/User.model';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  @IsArray()
  @IsNotEmpty()
  items: CartItem[];
}

export class UpdateCartItems extends AddToCartDto {}

export class CartItemWithoutQuantity {
  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @IsEnum(CartItemType)
  @IsNotEmpty()
  itemType: CartItemType;
}

export class RemoveFromCartDto {
  @ValidateNested({ each: true })
  @Type(() => CartItemWithoutQuantity)
  @IsArray()
  @IsNotEmpty()
  items: CartItemWithoutQuantity[];
}
