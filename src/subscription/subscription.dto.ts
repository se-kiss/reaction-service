import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class SubscriptionId {
  _id: Types.ObjectId
}

export class CreateSubscriptionArgs {
  userId: Types.ObjectId
  follower?: Types.ObjectId[]
  following?: Types.ObjectId[]
}

export class GetSubscriptionsArgs {
  @IsOptional()
  @IsArray()
  @Transform((values: string[]) => {
    return values.length === 0
      ? undefined
      : values.map(value => new Types.ObjectId(value));
  })
  ids?: Types.ObjectId[];
}

export class UpdateSubscriptionArgs {
  _id: Types.ObjectId
  follower?: Types.ObjectId
  following?: Types.ObjectId
}