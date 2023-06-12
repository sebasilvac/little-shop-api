import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../auth/entities/user.entity';
import { Product } from 'src/products/entities';

@Entity({ name: 'stores' })
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { unique: true })
  slug: string;

  @OneToMany(() => Product, (product) => product.store)
  products?: Product[];

  @OneToOne(() => User, (user) => user.store)
  @JoinColumn()
  user: User;

  @ManyToOne(() => User, (user) => user.stores, { eager: false })
  createdBy: User;

  @BeforeInsert()
  checkSlugInert() {
    if (!this.slug) {
      this.slug = this.name;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(/ /g, '_')
      .replaceAll(/'/g, '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(/ /g, '_')
      .replaceAll(/'/g, '');
  }
}
