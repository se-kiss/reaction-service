import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSubscriptionArgs, GetSubscriptionsArgs, UpdateSubscriptionArgs } from './subscription.dto';
import { Subscription } from './subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
  ) {}

  async create(args: CreateSubscriptionArgs): Promise<Subscription> {
    const created = new this.subscriptionModel(args)
    return await created.save()
  }

  async gets({ ids }: GetSubscriptionsArgs): Promise<Subscription[]> {
    const selected = this.subscriptionModel.find({});
    ids && selected.find({ _id: { $in: ids } });
    return await selected.exec();
  }

  async get(_id: Types.ObjectId): Promise<Subscription> {
    const selected = this.subscriptionModel.findById(_id);
    return await selected.exec();
  }

  async update(args: UpdateSubscriptionArgs): Promise<Subscription> {
    const tempdata = await this.subscriptionModel.findOne(args._id)
    tempdata.follower.push(args.follower)
    tempdata.following.push(args.following)
    const updated = await this.subscriptionModel.updateOne(
      args._id,
      {
        following: tempdata.following,
        follower: tempdata.follower,
        _updatedAt: new Date(),
      }
    )
    if (!updated) throw new NotFoundException()
    return this.subscriptionModel.findById(updated._id).exec()
  }

  async unfollowUpdate(_id: Types.ObjectId , data: Types.ObjectId[]): Promise<Subscription> {
    const tempdata = await this.subscriptionModel.findOne(_id)
    const updated = await this.subscriptionModel.updateOne(
      _id,
      {
        following: data,
        _updatedAt: new Date(),
      }
    )
    if (!updated) throw new NotFoundException()
    return this.subscriptionModel.findById(updated._id).exec()
  }
}
