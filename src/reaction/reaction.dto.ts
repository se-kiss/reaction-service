import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Reaction, ReactionType } from './reaction.schema';

export class ReactionId {
  _id: Types.ObjectId
}

export class CreateReactionArgs implements Partial<Reaction> {

  @Transform(value => new Types.ObjectId(value))
  sourceId: Types.ObjectId

  @Transform((values: string[]) => {
    return values.length === 0
      ? undefined
      : values.map(value => new Types.ObjectId(value));
  })
  upVote?: Types.ObjectId[]

  @Transform((values: string[]) => {
    return values.length === 0
      ? undefined
      : values.map(value => new Types.ObjectId(value));
  })
  downVote?: Types.ObjectId[]

  reactionType: ReactionType
}

export class GetReactionsArgs {
  @IsOptional()
  @IsArray()
  @Transform((values: string[]) => {
    return values.length === 0
      ? undefined
      : values.map(value => new Types.ObjectId(value));
  })
  ids?: Types.ObjectId[];
}

export class UpdateReactionArgs implements Partial<CreateReactionArgs> {
  _id: Types.ObjectId

  @Transform((values: string[]) => {
    return values.length === 0
      ? undefined
      : values.map(value => new Types.ObjectId(value));
  })
  upVote?: Types.ObjectId[]

  @Transform((values: string[]) => {
    return values.length === 0
      ? undefined
      : values.map(value => new Types.ObjectId(value));
  })
  downVote?: Types.ObjectId[]
}

export class VoteArgs {
  @Transform(value => new Types.ObjectId(value))
  targetId: Types.ObjectId
  
  @Transform(value => new Types.ObjectId(value))
  userId: Types.ObjectId
}