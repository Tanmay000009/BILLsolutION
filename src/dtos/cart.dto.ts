import { IsInstance, IsUUID } from 'class-validator';
import { CartItem } from '../models/User.model';

export class AddToCartDto {
  @IsInstance(CartItem, { each: true })
  items: CartItem[];
}

export class UpdateCartItems extends AddToCartDto {}

export class RemoveFromCartDto extends AddToCartDto {}
