import {
  Column,
  CreateDateColumn,
  Entity,
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
  itemId: string;

  @Column({
    type: 'enum',
    enum: CartItemType
  })
  itemType: CartItemType;

  @Column()
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
    type: 'simple-array',
    default: []
  })
  cart: CartItem[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
