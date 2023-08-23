import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Product } from './Product.model';
import { Order } from './Order.model';
import { Service } from './Service.model';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column('float')
  tax: number;

  @Column('float')
  totalAmount: number;

  @Column('float')
  totalAmountWithoutTax: number;

  @Column()
  taxCategories: string;

  @Column()
  taxBreakdown: string;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Service)
  service: Service;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
