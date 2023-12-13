import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { UserType } from './user.type';
import { RoleType } from 'src/roles/entities/role.type';
import { StatusType } from 'src/statuses/entities/status.type';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';
import { Exclude, Expose, Type } from 'class-transformer';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';
import { FileSchemaClass } from 'src/files/entities/file.schema';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends EntityDocumentHelper implements UserType {
  id: string;

  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['system', 'me', 'admin'], toPlainOnly: true })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  @Prop()
  password: string;

  @Exclude({ toPlainOnly: true })
  previousPassword: string;

  @Expose({ groups: ['system', 'me', 'admin'], toPlainOnly: true })
  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @Expose({ groups: ['system', 'me', 'admin'], toPlainOnly: true })
  @Prop({
    type: String,
    default: null,
  })
  socialId: string | null;

  @Prop({
    type: String,
  })
  firstName: string | null;

  @Prop({
    type: String,
  })
  lastName: string | null;

  @Prop({
    type: FileSchemaClass,
  })
  @Type(() => FileSchemaClass)
  photo?: FileSchemaClass | null;

  @Prop({
    type: RoleType,
  })
  role?: RoleType | null;

  @Prop({
    type: StatusType,
  })
  status?: StatusType;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);

UserSchema.virtual('id').get(function () {
  return this._id;
});

UserSchema.virtual('previousPassword').get(function () {
  return this.password;
});

UserSchema.index({ 'role.id': 1 });
