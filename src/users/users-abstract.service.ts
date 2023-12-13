import { UserType } from './entities/user.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { CreateUserDto } from './dto/create-user.dto';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

export abstract class UsersServiceAbstract {
  abstract create(createProfileDto: CreateUserDto): Promise<UserType>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<UserType[]>;

  abstract findOne(
    fields: EntityCondition<UserType>,
  ): Promise<NullableType<UserType>>;

  abstract update(
    id: UserType['id'],
    payload: DeepPartial<UserType>,
  ): Promise<UserType | null>;

  abstract softDelete(id: UserType['id']): Promise<void>;
}
