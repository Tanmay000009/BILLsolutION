import 'reflect-metadata';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  Min
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  MoreThan,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { Order } from './Order.model';

export enum CartItemType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE'
}
export class CartItem {
  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @IsEnum(CartItemType)
  @IsNotEmpty()
  itemType: CartItemType;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;
}

@Entity()
export class User {
  @PrimaryColumn('text')
  email: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text')
  firebaseId: string;

  @Column('bool', { default: false })
  isAdmin: boolean;

  @Column('text', {
    default: '[]'
  })
  cart: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
