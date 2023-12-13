import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { FilesServiceAbstract } from './files-abstract.service';
import { FileSchemaClass } from './entities/file.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileType } from './entities/file.type';
import { plainToInstance } from 'class-transformer';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class FilesDocumentService implements FilesServiceAbstract {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectModel(FileSchemaClass.name)
    private fileModel: Model<FileSchemaClass>,
  ) {}

  async create(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileType> {
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

    const createdFile = new this.fileModel({
      path: path[this.configService.getOrThrow('file.driver', { infer: true })],
    });
    const fileObject = await createdFile.save();
    return plainToInstance(FileSchemaClass, fileObject.toJSON(), {
      groups: ['system'],
    });
  }

  async findOne(
    fields: EntityCondition<FileType>,
  ): Promise<NullableType<FileType>> {
    if (fields.id) {
      const fileObject = await this.fileModel.findById(fields.id);
      return plainToInstance(FileSchemaClass, fileObject?.toJSON(), {
        groups: ['system'],
      });
    }

    const userObject = await this.fileModel.findOne(fields);
    return plainToInstance(FileSchemaClass, userObject?.toJSON(), {
      groups: ['system'],
    });
  }
}
