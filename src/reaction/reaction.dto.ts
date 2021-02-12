import { Type, Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { Reaction, ReactionType } from './reaction.schema';

export class CreateReactionArgs implements Partial<Reaction> {
  upVote?: Types.ObjectId[]

  downVote?: Types.ObjectId[]

  reactionType: ReactionType
}