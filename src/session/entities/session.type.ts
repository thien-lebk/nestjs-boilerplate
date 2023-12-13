import { UserType } from 'src/users/entities/user.type';

export abstract class SessionType {
  _id?: string;
  id: number | string;
  user: UserType;
  createdAt: Date;
  deletedAt: Date;
}
