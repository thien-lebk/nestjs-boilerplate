import { ApiProperty } from '@nestjs/swagger';
import { StatusType } from '../entities/status.type';
import { IsNumber } from 'class-validator';

export class StatusDto implements StatusType {
  @ApiProperty()
  @IsNumber()
  id: number;
}
