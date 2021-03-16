import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { CreateSubscriptionArgs, GetSubscriptionsArgs, SubscriptionId, UpdateSubscriptionArgs} from './subscription.dto';
import { SubscriptionService } from './subscription.service';
import { status } from 'grpc';
import { Subscription } from './subscription.schema';
import { Types } from 'mongoose';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @GrpcMethod('SubscriptionService', 'CreateSubscription')
  async createSubscription(args: CreateSubscriptionArgs) {
    return await this.subscriptionService.create(args);
  }

  @GrpcMethod('SubscriptionService', 'GetSubscriptions')
  async getSubscriptions(args: GetSubscriptionsArgs): Promise<{subscriptions: Subscription[]}> {
    try {
      return { subscriptions: await this.subscriptionService.gets(args) }
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      })
    }
  }

  @GrpcMethod('SubscriptionService', 'UpdateSubscription')
  async updateSubscription(args: UpdateSubscriptionArgs): Promise<Subscription> {
    try {
      return this.subscriptionService.update(args)
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      })
    }
  }

  @GrpcMethod('SubscriptionService', 'DeleteSubscription')
  async unFollow({ _id }: SubscriptionId, targetId: Types.ObjectId) {
    try {
      const tempdata = await this.subscriptionService.get(_id)
      tempdata.following = tempdata.following.filter(value => value.toHexString() !== targetId.toHexString())
      return await this.subscriptionService.unfollowUpdate(_id,tempdata.following)
      
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