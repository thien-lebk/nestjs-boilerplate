import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { RoleType } from '../entities/role.type';

export class RoleDto implements RoleType {
  @ApiProperty()
  @IsNumber()
  id: number;
}
