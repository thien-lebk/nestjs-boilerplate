import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { StatusType } from './status.type';

@Entity()
export class Status extends EntityRelationalHelper implements StatusType {
  @ApiProperty({ example: 1 })
  @PrimaryColumn()
  id: number;

  @Allow()
  @ApiProperty({ example: 'Active' })
  @Column()
  name?: string;
}
