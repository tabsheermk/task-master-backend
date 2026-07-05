import { TaskStatus } from 'src/modules/task/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// TODO: Keeping it simple for now. Make it better later
@Entity()
export class SubTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  taskId: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column('uuid', { nullable: true })
  assigneeId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
