import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ReactionType {
  COMMENT,
  POST
}

@Schema({
  timestamps: {
    createdAt: '_createdAt',
    updatedAt: '_updatedAt',
  }
})
export class Reaction extends Document {
  _createdAt: Date
  _updatedAt: Date

  @Prop({ type: Types.ObjectId , default: [] })
  upVote: Types.ObjectId[]

  @Prop({ type: Types.ObjectId, default: [] })
  downVote: Types.ObjectId[]

  @Prop({ type: ReactionType, required: true })
  reactionType: ReactionType

}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);