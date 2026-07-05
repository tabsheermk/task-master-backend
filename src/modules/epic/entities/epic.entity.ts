import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EpicStatus {
  CREATED = 'created',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

@Entity('epics')
export class Epic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: EpicStatus,
    default: EpicStatus.CREATED,
  })
  status: EpicStatus;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column('uuid')
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
