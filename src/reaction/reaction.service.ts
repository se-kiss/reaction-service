import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction } from './reaction.schema';

@Injectable()
export class ReactionService {
  constructor(
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<Reaction>,
  ) {}
}
