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

  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId

  @Prop({type: Types.ObjectId})
  upVote: Types.ObjectId[]

  @Prop({type: Types.ObjectId})
  downVote: Types.ObjectId[]

  @Prop({type: ReactionType})
  reactionType: ReactionType

}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);