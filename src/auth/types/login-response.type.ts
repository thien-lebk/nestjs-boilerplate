import { UserType } from 'src/users/entities/user.type';

export type LoginResponseType = Readonly<{
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: UserType;
}>;
