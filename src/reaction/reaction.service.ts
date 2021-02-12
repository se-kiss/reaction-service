import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReactionArgs, GetReactionsArgs } from './reaction.dto';
import { Reaction } from './reaction.schema';

@Injectable()
export class ReactionService {
  constructor(
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<Reaction>,
  ) {}

  async create(args: CreateReactionArgs): Promise<Reaction> {
    const created = new this.reactionModel(args)
    return await created.save()
  }

  async gets({ ids }: GetReactionsArgs): Promise<Reaction[]> {
    const selected = this.reactionModel.find({});
    ids && selected.find({ _id: { $in: ids } });
    return await selected.exec();
  }
}
