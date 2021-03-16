import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSubscriptionArgs, GetSubscriptionsArgs, UnFollowArgs, UpdateSubscriptionArgs } from './subscription.dto';
import { Subscription } from './subscription.schema';

@Injectable()
export class SubscriptionService implements OnModuleInit {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
  ) {}

  async onModuleInit() {
    this.subscriptionModel.syncIndexes()
  }

  async create(args: CreateSubscriptionArgs): Promise<Subscription> {
    const created = new this.subscriptionModel(args)
    return await created.save()
  }

  async gets({ ids }: GetSubscriptionsArgs): Promise<Subscription[]> {
    const selected = this.subscriptionModel.find({});
    ids && selected.find({ userId: { $in: ids } });
    return await selected.exec();
  }

  async get(userId: Types.ObjectId): Promise<Subscription> {
    const selected = this.subscriptionModel.findOne({userId});
    return await selected.exec();
  }

  async update(args: UpdateSubscriptionArgs): Promise<Subscription> {
    const selectData = await this.subscriptionModel.findOne({ userId: args.userId });

    if (args.follower && !selectData.follower.includes(args.follower)) {
      selectData.follower.push(args.follower)
    }
    if (args.following && !selectData.following.includes(args.following)) {
      selectData.following.push(args.following)
    }
    const updated = await this.subscriptionModel.findOneAndUpdate(
      {userId: args.userId},
      {
        following: selectData.following,
        follower: selectData.follower,
        _updatedAt: new Date(),
      }
    )
    if (!updated) throw new NotFoundException()
    return this.subscriptionModel.findById(updated._id).exec()
  }

  async unfollowUpdate(args: UnFollowArgs): Promise<Subscription> {
    const selectData = await this.subscriptionModel.findOne({ userId: args.userId });
    let followUser: Types.ObjectId[]
    if (selectData.following) {
      followUser = selectData.following.filter((e) => e !== args.targetId ) 
    }
    const updated = await this.subscriptionModel.findOneAndUpdate(
      {userId: args.userId},
      {
        following: followUser,
        _updatedAt: new Date(),
      }
    )
    if (!updated) throw new NotFoundException()
    return this.subscriptionModel.findById(updated._id).exec()
  }
}
