import { Subscription, SubscriptionSchema } from './subscription.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { SubscriptionService } from './subscription.service';
import { clearDatebase } from '../../test/fixture/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { CreateSubscriptionArgs, UpdateSubscriptionArgs } from './subscription.dto';
import { NotFoundException } from '@nestjs/common';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let mongoose: Model<Subscription>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URL),
        MongooseModule.forFeature([
          {
            name: Subscription.name,
            schema: SubscriptionSchema
          }
        ])
      ],
      providers: [SubscriptionService],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    mongoose = module.get(getModelToken(Subscription.name))

    await clearDatebase<Subscription>(mongoose);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should be create Subscription', async () => {
  //   const mockSubscription: CreateSubscriptionArgs = {

  //   }
  //   const res = await service.create(mockSubscription)
  //   expect(res).toMatchObject(mockSubscription)
  // })

  // it('should get subscription', async () => {
  //   const mockSubscription: CreateSubscriptionArgs = {

  //   }
  //   const created = await service.create(mockSubscription)
  //   const selected = await service.gets({ ids: created._id })
  //   console.log(selected)
  // });

  // it('should update', async () => {
  //   const subscription = await service.create({})
  //   const args: UpdateSubscriptionArgs = {
  //     _id: subscription._id,
  //     follower: new Types.ObjectId,
  //     following: new Types.ObjectId
  //   }
  //   const updated = await service.update(args)
  //   console.log(updated)
  // })

  // it('should unfollowupdate', async () => {
  //   const subscription = await service.create({
  //     follower: [new Types.ObjectId],
  //     following: [new Types.ObjectId]
  //   })
  //   const _id = subscription._id
  //   const data = [new Types.ObjectId]
  //   const updated = await service.unfollowUpdate(_id,data)
  //   console.log("This is last data")
  //   console.log(subscription)
  //   console.log(updated)
  // })

});