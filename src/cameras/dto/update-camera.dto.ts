import { PartialType } from '@nestjs/swagger';
import { CreateCameraDto } from './create-camera.dto';

import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Validate } from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class UpdateUserDto extends PartialType(CreateCameraDto) {
  @ApiProperty({ example: 'camera-name' })
  @Transform(lowerCaseTransformer)
  @Validate(IsNotExist, ['Camera'], {
    message: 'nameAlreadyExists',
  })
  @IsString()
  name?: string;
}
