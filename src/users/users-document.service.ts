import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserType } from './entities/user.type';
import { UsersServiceAbstract } from './users-abstract.service';
import { UserSchemaClass } from './entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { FilesServiceAbstract } from 'src/files/files-abstract.service';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

@Injectable()
export class UsersDocumentService implements UsersServiceAbstract {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly usersModel: Model<UserSchemaClass>,
    private readonly filesService: FilesServiceAbstract,
  ) {}

  async create(createProfileDto: CreateUserDto): Promise<UserType> {
    const clonedPayload = { ...createProfileDto };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersModel.findOne({
        email: clonedPayload.email,
      });
      if (userObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: 'emailAlreadyExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findOne({
        _id: clonedPayload.photo.id,
      });
      if (!fileObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              photo: 'imageNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              role: 'roleNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              status: 'statusNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const createdUser = new this.usersModel(clonedPayload);
    const userObject = await createdUser.save();
    return plainToInstance(UserSchemaClass, userObject.toJSON(), {
      groups: ['system'],
    });
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<UserType[]> {
    const where: EntityCondition<UserType> = {};
    if (filterOptions?.roles?.length) {
      where['role.id'] = {
        $in: filterOptions.roles.map((role) => role.id),
      };
    }

    const userObjects = await this.usersModel
      .find(where)
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy === 'id' ? '_id' : sort.orderBy]:
              sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return userObjects.map((user) =>
      plainToInstance(UserSchemaClass, user.toJSON(), {
        groups: ['system'],
      }),
    );
  }

  async findOne(
    fields: EntityCondition<UserType>,
  ): Promise<NullableType<UserType>> {
    if (fields.id) {
      const userObject = await this.usersModel.findById(fields.id);
      return plainToInstance(UserSchemaClass, userObject?.toJSON(), {
        groups: ['system'],
      });
    }

    const userObject = await this.usersModel.findOne(fields);
    return plainToInstance(UserSchemaClass, userObject?.toJSON(), {
      groups: ['system'],
    });
  }

  async update(
    id: UserType['id'],
    payload: DeepPartial<UserType>,
  ): Promise<UserType | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;
    delete clonedPayload._id;

    if (
      clonedPayload.password &&
      clonedPayload.previousPassword !== clonedPayload.password
    ) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersModel.findOne({
        email: clonedPayload.email,
      });

      if (userObject?._id.toString() !== id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: 'emailAlreadyExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findOne({
        _id: clonedPayload.photo.id,
      });
      if (!fileObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              photo: 'imageNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              role: 'roleNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              status: 'statusNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const filter = { _id: id };
    const userObject = await this.usersModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );
    return plainToInstance(UserSchemaClass, userObject?.toJSON(), {
      groups: ['system'],
    });
  }

  async softDelete(id: UserType['id']): Promise<void> {
    await this.usersModel.deleteOne({
      _id: id,
    });
  }
}
