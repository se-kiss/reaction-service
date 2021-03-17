import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class SubscriptionId {
  _id: Types.ObjectId
}

export class CreateSubscriptionArgs {
  @Transform(value => new Types.ObjectId(value))
  userId: Types.ObjectId

  @Transform((values: string[]) =>
    values.map(value => new Types.ObjectId(value)),
  )
  follower?: Types.ObjectId[]

  @Transform((values: string[]) =>
    values.map(value => new Types.ObjectId(value)),
  )
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
  @Transform(value => new Types.ObjectId(value))
  userId: Types.ObjectId

  @Transform((values: string[]) =>
    values.map(value => new Types.ObjectId(value)),
  )
  follower?: Types.ObjectId

  @Transform((values: string[]) =>
    values.map(value => new Types.ObjectId(value)),
  )
  following?: Types.ObjectId
}

export class UnFollowArgs {
  @Transform(value => new Types.ObjectId(value))
  userId: Types.ObjectId
  targetId: Types.ObjectId
}