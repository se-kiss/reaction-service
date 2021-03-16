import { Injectable, NotFoundException ,OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNotificationArgs, GetNotificationsArgs } from './notification.dto';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async onModuleInit() {
    this.notificationModel.syncIndexes()
  }

  async create(args: CreateNotificationArgs): Promise<Notification> {
    const created = new this.notificationModel(args)
    return await created.save()
  }

  async gets({ ids }: GetNotificationsArgs): Promise<Notification[]> {
    const selected = this.notificationModel.find({});
    ids && selected.find({ ownerId: { $in: ids } });
    return await selected.exec();
  }

  async delete( ownerId: Types.ObjectId ): Promise<Notification> {
    const deleted = this.notificationModel.findOneAndDelete({ownerId}).exec()
    if (!deleted) throw new NotFoundException()
    return deleted
  }
}
