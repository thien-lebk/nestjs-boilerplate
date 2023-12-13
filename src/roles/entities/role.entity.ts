import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNumber } from 'class-validator';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { RoleType } from './role.type';

@Entity()
export class Role extends EntityRelationalHelper implements RoleType {
  @ApiProperty({ example: 1 })
  @PrimaryColumn()
  @IsNumber()
  id: number;

  @Allow()
  @ApiProperty({ example: 'Admin' })
  @Column()
  name?: string;
}
