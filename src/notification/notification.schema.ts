import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum NotificationType {
  COMMENT,
  POST
}

@Schema({
  timestamps: {
    createdAt: '_createdAt',
    updatedAt: '_updatedAt',
  }
})
export class Notification extends Document {
  _createdAt: Date
  _updatedAt: Date

  @Prop({ type: Types.ObjectId , default: [] })
  upVote: Types.ObjectId[]

  @Prop({ type: Types.ObjectId, default: [] })
  downVote: Types.ObjectId[]

  @Prop({ type: NotificationType, required: true })
  reactionType: NotificationType

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);