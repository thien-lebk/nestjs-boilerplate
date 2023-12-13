import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AllConfigType } from 'src/config/config.type';
import { FilesServiceAbstract } from './files-abstract.service';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class FilesRelationalService implements FilesServiceAbstract {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileEntity> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = {
      local: `/${this.configService.get('app.apiPrefix', { infer: true })}/v1/${
        file.path
      }`,
      s3: (file as Express.MulterS3.File).location,
    };

    return this.fileRepository.save(
      this.fileRepository.create({
        path: path[
          this.configService.getOrThrow('file.driver', { infer: true })
        ],
      }),
    );
  }

  findOne(
    fields: EntityCondition<FileEntity>,
  ): Promise<NullableType<FileEntity>> {
    return this.fileRepository.findOne({
      where: fields as FindOptionsWhere<FileEntity>,
    });
  }
}
