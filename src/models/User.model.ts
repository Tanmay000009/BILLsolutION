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

export enum CartItemType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE'
}
export class CartItem {
  @Column({
    type: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @Column({
    type: 'enum',
    enum: CartItemType
  })
  @IsEnum(CartItemType)
  @IsNotEmpty()
  itemType: CartItemType;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;
}

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  firebaseId: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({
    default: '[]'
  })
  cart: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
