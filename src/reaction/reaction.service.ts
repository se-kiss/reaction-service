import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReactionArgs, GetReactionsArgs, UpdateReactionArgs, VoteArgs } from './reaction.dto';
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

  async gets({ ids, filter }: GetReactionsArgs): Promise<Reaction[]> {
    const reaction = this.reactionModel.find({});
    if (filter ) reaction.find({ reactionType: filter.reactionType });
    ids && reaction.find({ _id: { $in: ids } });
    return await reaction.exec();
  }

  async update(args: UpdateReactionArgs): Promise<Reaction> {
    const updated = await this.reactionModel.findByIdAndUpdate(
    args._id,
      {
        ...args,
        _updatedAt: new Date(),
      }
    )
    if (!updated) throw new NotFoundException()
    return this.reactionModel.findById(updated._id).exec()
  }

  async delete( _id: Types.ObjectId ): Promise<Reaction> {
    const deleted = this.reactionModel.findByIdAndDelete(_id).exec()
    if (!deleted) throw new NotFoundException()
    return deleted
  }
}
