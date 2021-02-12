import { Reaction, ReactionSchema, ReactionType } from './reaction.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ReactionService } from './reaction.service';
import { clearDatebase } from '../../test/fixture/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { CreateReactionArgs } from './reaction.dto';
import { NotFoundException } from '@nestjs/common';

describe('ReactionService', () => {
  let service: ReactionService;
  let mongoose: Model<Reaction>

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
      providers: [ReactionService],
    }).compile();

    service = module.get<ReactionService>(ReactionService);
    mongoose = module.get(getModelToken(Reaction.name))

    await clearDatebase<Reaction>(mongoose);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create Reaction', async () => {
    const mockReaction: CreateReactionArgs = {
      upVote: [new Types.ObjectId],
      downVote: [new Types.ObjectId],
      reactionType: ReactionType.COMMENT
    }
    const res = await service.create(mockReaction)
    expect(res).toMatchObject(mockReaction)
  })
});