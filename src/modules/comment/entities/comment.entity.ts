import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// TODO: Add nested replies later
@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  taskId: string;

  @Column('uuid')
  userId: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
