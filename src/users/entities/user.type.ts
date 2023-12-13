import { FileType } from 'src/files/entities/file.type';
import { RoleType } from 'src/roles/entities/role.type';
import { StatusType } from 'src/statuses/entities/status.type';

export abstract class UserType {
  _id?: string;
  id: number | string;
  email: string | null;
  password: string;
  previousPassword: string;
  provider: string;
  socialId: string | null;
  firstName: string | null;
  lastName: string | null;
  photo?: FileType | null;
  role?: RoleType | null;
  status?: StatusType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
