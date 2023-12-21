import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';

export class CreateCameraDto {
  @ApiProperty({ example: 'camera-name' })
  @IsNotEmpty()
  @Validate(IsNotExist, ['Camera'], {
    message: 'nameAlreadyExists',
  })
  @IsString()
  name: string;
}
