import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: '_createdAt',
    updatedAt: '_updatedAt',
  }
})
export class Subscription extends Document {
  _createdAt: Date
  _updatedAt: Date

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId

  @Prop({ type: Types.ObjectId , default: [] })
  follower: Types.ObjectId[]

  @Prop({ type: Types.ObjectId, default: [] })
  following: Types.ObjectId[]
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);