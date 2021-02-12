import { ConfigModule } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { ReactionController } from './reaction.controller';
import { CreateReactionArgs, UpdateReactionArgs, VoteArgs } from './reaction.dto';
import { Reaction, ReactionSchema, ReactionType } from './reaction.schema';
import { ReactionService } from './reaction.service';

describe('ReactionController', () => {
  let controller: ReactionController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URL),
        MongooseModule.forFeature([
          {
            name: Reaction.name,
            schema: ReactionSchema
          }
        ])
      ],
      controllers: [ReactionController],
      providers: [ReactionService],
    }).compile();

    controller = module.get<ReactionController>(ReactionController)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be upVote', async () => {
    const mockReaction: CreateReactionArgs = {
      reactionType: ReactionType.COMMENT
    }
    const mock = await controller.createReaction(mockReaction)
    const data: VoteArgs = {
      userId: new Types.ObjectId,
      targetId: mock._id
    }
    const res = await controller.upVote(data)
    console.log(res)
    expect(res.upVote).toHaveLength(mock.upVote.length + 1)
  })
});