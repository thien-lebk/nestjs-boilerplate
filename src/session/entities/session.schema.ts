import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, HydratedDocument } from 'mongoose';
import { SessionType } from './session.type';
import { UserSchemaClass } from 'src/users/entities/user.schema';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

export type SessionSchemaDocument = HydratedDocument<SessionSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class SessionSchemaClass
  extends EntityDocumentHelper
  implements SessionType
{
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSchemaClass' })
  user: UserSchemaClass;

  @Prop({ default: now })
  createdAt: Date;

  @Prop()
  deletedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(SessionSchemaClass);

SessionSchema.virtual('id').get(function () {
  return this._id.toString();
});

SessionSchema.index({ user: 1 });
