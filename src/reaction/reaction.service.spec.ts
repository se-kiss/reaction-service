import { Reaction, ReactionSchema, ReactionType } from './reaction.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ReactionService } from './reaction.service';
import { clearDatebase } from '../../test/fixture/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { CreateReactionArgs, UpdateReactionArgs } from './reaction.dto';
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

  it('should get reaction', async () => {
    const mockReaction: CreateReactionArgs = {
      upVote: [new Types.ObjectId],
      downVote: [new Types.ObjectId],
      reactionType: ReactionType.COMMENT
    }
    const created = await service.create(mockReaction)
    const selected = await service.gets({ ids: created._id })
    expect(selected[0]._id).toEqual(created._id);
    expect(selected[0].upVote).toEqual(created.upVote);
    expect(selected[0].downVote).toEqual(created.downVote);
    expect(selected[0].reactionType).toEqual(created.reactionType);
  });

  it('should get all reaction', async () => {
    const selected = await service.gets({})
    console.log(selected)
    expect(selected).toHaveLength(2)
  })

  it('should update', async () => {
    const reaction = await service.create({
      reactionType: ReactionType.POST
    })
    const args: UpdateReactionArgs = {
      _id: reaction._id,
      upVote: [new Types.ObjectId],
    }
    const updated = await service.update(args)
    expect(updated._id).toEqual(args._id)
    expect(updated.upVote).toHaveLength(reaction.upVote.length + 1)
  })

  it('should delete reaction', async () => {
    const reaction = await service.create({
      reactionType: ReactionType.POST
    })
    await service.delete(reaction._id);
    expect(await service.gets({ ids: [reaction._id] })).toHaveLength(0);
  });
});