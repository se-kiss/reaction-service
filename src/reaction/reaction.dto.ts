import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { Reaction, ReactionType } from './reaction.schema';

export class ReactionId {
  _id: Types.ObjectId
}

export class GetReactionsFilter {
  @IsOptional()
  @IsEnum(ReactionType)
  reactionType?: ReactionType
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
  @ValidateNested()
  @Type(() => GetReactionsFilter)
  filter?: GetReactionsFilter;

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