import { Injectable } from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { SessionAbstractService } from './session-abstract.service';
import { SessionType } from './entities/session.type';
import { SessionSchemaClass } from './entities/session.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { UserType } from 'src/users/entities/user.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

@Injectable()
export class SessionDocumentService implements SessionAbstractService {
  constructor(
    @InjectModel(SessionSchemaClass.name)
    private sessionModel: Model<SessionSchemaClass>,
  ) {}

  async findOne(
    options: EntityCondition<SessionType>,
  ): Promise<NullableType<SessionType>> {
    const clonedOptions = { ...options };
    if (clonedOptions.id) {
      clonedOptions._id = clonedOptions.id.toString();
      delete clonedOptions.id;
    }

    const sessionObject = await this.sessionModel.findOne(clonedOptions);

    return plainToInstance(SessionSchemaClass, sessionObject?.toJSON());
  }

  async create(data: DeepPartial<SessionType>): Promise<SessionType> {
    const createdSession = new this.sessionModel(data);
    const sessionObject = await createdSession.save();
    return plainToInstance(SessionSchemaClass, sessionObject.toJSON());
  }

  async softDelete({
    excludeId,
    ...criteria
  }: {
    id?: SessionType['id'];
    user?: Pick<UserType, 'id'>;
    excludeId?: SessionType['id'];
  }): Promise<void> {
    const transformedCriteria = {
      user: criteria.user?.id,
      _id: criteria.id
        ? criteria.id
        : excludeId
          ? { $not: { $eq: excludeId } }
          : undefined,
    };
    await this.sessionModel.deleteMany(transformedCriteria);
  }
}
