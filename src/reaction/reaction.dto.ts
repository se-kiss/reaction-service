import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Reaction, ReactionType } from './reaction.schema';

export class CreateReactionArgs implements Partial<Reaction> {
  upVote?: Types.ObjectId[]

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
  upVote?: Types.ObjectId[]
  downVote?: Types.ObjectId[]
}

export class VoteArgs {
  targetId: Types.ObjectId
  userId: Types.ObjectId
}