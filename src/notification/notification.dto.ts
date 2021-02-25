import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Notification, NotificationType } from './notification.schema';

export class NotificationId {
  _id: Types.ObjectId
}

export class CreateNotificationArgs implements Partial<Notification> {
  notificationType: NotificationType
}

export class GetNotificationsArgs {
  @IsOptional()
  @IsArray()
  @Transform((values: string[]) => {
    return values.length === 0
      ? undefined
      : values.map(value => new Types.ObjectId(value));
  })
  ids?: Types.ObjectId[];
}
