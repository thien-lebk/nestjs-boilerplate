import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { NullableType } from '../utils/types/nullable.type';
import { User } from 'src/users/entities/user.entity';
import { SessionAbstractService } from './session-abstract.service';
import { SessionType } from './entities/session.type';
import { UserType } from 'src/users/entities/user.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

@Injectable()
export class SessionRelationalService implements SessionAbstractService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async findOne(
    options: EntityCondition<SessionType>,
  ): Promise<NullableType<SessionType>> {
    return this.sessionRepository.findOne({
      where: options as FindOptionsWhere<Session>,
    });
  }

  async create(data: DeepPartial<SessionType>): Promise<SessionType> {
    return this.sessionRepository.save(
      this.sessionRepository.create(data as DeepPartial<Session>),
    );
  }

  async softDelete({
    excludeId,
    ...criteria
  }: {
    id?: SessionType['id'];
    user?: Pick<UserType, 'id'>;
    excludeId?: SessionType['id'];
  }): Promise<void> {
    await this.sessionRepository.softDelete({
      ...(criteria as {
        id?: Session['id'];
        user?: Pick<User, 'id'>;
      }),
      id: criteria.id
        ? (criteria.id as Session['id'])
        : excludeId
          ? Not(excludeId as Session['id'])
          : undefined,
    });
  }
}
