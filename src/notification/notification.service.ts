import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNotificationArgs, GetNotificationsArgs } from './notification.dto';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async create(args: CreateNotificationArgs): Promise<Notification> {
    const created = new this.notificationModel(args)
    return await created.save()
  }

  async gets({ ids }: GetNotificationsArgs): Promise<Notification[]> {
    const selected = this.notificationModel.find({});
    ids && selected.find({ userId: { $in: ids } });
    return await selected.exec();
  }

  async delete( _id: Types.ObjectId ): Promise<Notification> {
    const deleted = this.notificationModel.findByIdAndDelete(_id).exec()
    if (!deleted) throw new NotFoundException()
    return deleted
  }
}
