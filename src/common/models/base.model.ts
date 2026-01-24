import { modelOptions, Severity } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
      transform: (_doc: unknown, ret: Record<string, any>) => {
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export abstract class BaseModel {
  // @IsOptional()
  // @prop()
  public _id?: Schema.Types.ObjectId;

  public createdAt: Date;

  public updatedAt: Date;
}
