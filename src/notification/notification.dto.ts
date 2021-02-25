import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Notification, NotificationType } from './notification.schema';

export class NotificationId {
  _id: Types.ObjectId
}

export class CreateNotificationArgs implements Partial<Notification> {
  upVote?: Types.ObjectId[]

  downVote?: Types.ObjectId[]

  reactionType: NotificationType
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

export class UpdateNotificationArgs implements Partial<CreateNotificationArgs> {
  _id: Types.ObjectId
  upVote?: Types.ObjectId[]
  downVote?: Types.ObjectId[]
}

export class VoteArgs {
  targetId: Types.ObjectId
  userId: Types.ObjectId
}