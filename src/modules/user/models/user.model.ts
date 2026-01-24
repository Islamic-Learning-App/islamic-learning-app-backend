import { modelOptions, prop } from '@typegoose/typegoose';
import { BaseModel } from '../../../common/models/base.model';

@modelOptions({ schemaOptions: { collection: 'users' } })
export class User extends BaseModel {
  @prop({ required: true, unique: true, lowercase: true, trim: true })
  public email: string;

  @prop({ required: true })
  public firstName: string;

  @prop({ required: true })
  public lastName: string;

  @prop()
  public picture?: string;

  @prop({ unique: true, sparse: true })
  public googleId?: string;
}
