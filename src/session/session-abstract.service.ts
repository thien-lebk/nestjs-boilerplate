import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { NullableType } from '../utils/types/nullable.type';
import { SessionType } from './entities/session.type';
import { UserType } from 'src/users/entities/user.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';

export abstract class SessionAbstractService {
  abstract findOne(
    options: EntityCondition<SessionType>,
  ): Promise<NullableType<SessionType>>;

  abstract create(data: DeepPartial<SessionType>): Promise<SessionType>;

  abstract softDelete({
    excludeId,
    ...criteria
  }: {
    id?: SessionType['id'];
    user?: Pick<UserType, 'id'>;
    excludeId?: SessionType['id'];
  }): Promise<void>;
}
