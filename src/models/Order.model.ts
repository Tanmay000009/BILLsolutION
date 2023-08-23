// order.entity.ts

import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './User.model';
import { OrderItem } from './OrderItem.model';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @Column('float')
  totalAmount: number;

  @Column('float')
  totalTax: number;

  @Column({
    type: 'enum',
    enum: OrderStatus
  })
  status: OrderStatus;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
