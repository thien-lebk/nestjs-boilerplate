import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FileType } from './entities/file.type';
import { NullableType } from 'src/utils/types/nullable.type';

export abstract class FilesServiceAbstract {
  abstract create(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileType>;

  abstract findOne(
    fields: EntityCondition<FileType>,
  ): Promise<NullableType<FileType>>;
}
