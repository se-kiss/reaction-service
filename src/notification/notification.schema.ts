import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ type: NotificationType, required: true })
  notificationType: NotificationType

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);