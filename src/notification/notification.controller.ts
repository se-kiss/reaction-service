import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { CreateNotificationArgs, GetNotificationsArgs, NotificationId } from './notification.dto';
import { NotificationService } from './notification.service';
import { status } from 'grpc';
import { Notification } from './notification.schema';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @GrpcMethod('NotificationService', 'CreateNotification')
  async createNotification(args: CreateNotificationArgs) {
    return await this.notificationService.create(args);
  }

  @GrpcMethod('NotificationService', 'GetNotifications')
  async getNotifications(args: GetNotificationsArgs): Promise<{notifications: Notification[]}> {
    try {
      return { notifications: await this.notificationService.gets(args) }
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      })
    }
  }

  @GrpcMethod('NotificationService', 'DeleteNotification')
  async deleteNotification({ _id }: NotificationId) {
    try {
      return await this.notificationService.delete(_id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: _id.toHexString(),
        });
      }
    }
  }
}