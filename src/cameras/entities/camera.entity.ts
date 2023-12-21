import {
  Column,
  // CreateDateColumn,
  // DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  // UpdateDateColumn,
} from 'typeorm';
// import { Status } from '../../statuses/entities/status.entity';
import { EntityHelper } from '../../utils/entity-helper';

@Entity()
export class Camera extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true, nullable: false })
  name: string;

  // @ManyToOne(() => Status, {
  //   eager: true,
  // })
  // status?: Status;

  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;

  // @DeleteDateColumn()
  // deletedAt: Date;
}
