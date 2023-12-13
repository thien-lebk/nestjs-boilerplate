import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../entities/file.type';
import { IsString } from 'class-validator';

export class FileDto implements FileType {
  @ApiProperty()
  @IsString()
  id: string;

  path: string;
}
