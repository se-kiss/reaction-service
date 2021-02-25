import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { SubscriptionController } from './subscription.controller';
import { CreateSubscriptionArgs } from './subscription.dto';
import { Subscription, SubscriptionSchema } from './subscription.schema';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;

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
      controllers: [SubscriptionController],
      providers: [SubscriptionService],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be upVote', async () => {
    const subscription = await controller.createSubscription({
      follower: [new Types.ObjectId],
      following: [new Types.ObjectId, new Types.ObjectId]
    })
    const targetId = subscription.following[0]
    console.log(targetId)
    const res = await controller.unFollow(subscription._id,targetId)
    console.log(res)
  })
});
