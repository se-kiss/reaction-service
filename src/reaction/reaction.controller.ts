import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { CreateReactionArgs, GetReactionsArgs, ReactionId, UpdateReactionArgs, VoteArgs } from './reaction.dto';
import { ReactionService } from './reaction.service';
import { status } from 'grpc';
import { Reaction } from './reaction.schema';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @GrpcMethod('ReactionService', 'CreateReaction')
  async createReaction(args: CreateReactionArgs) {
    return await this.reactionService.create(args);
  }

  @GrpcMethod('ReactionService', 'GetReactions')
  async getReactions(args: GetReactionsArgs): Promise<{reactions: Reaction[]}> {
    try {
      return { reactions: await this.reactionService.gets(args) }
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      })
    }
  }

  @GrpcMethod('ReactionService', 'DeleteReaction')
  async deleteReaction({ _id }: ReactionId) {
    try {
      return await this.reactionService.delete(_id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: _id.toHexString(),
        });
      }
    }
  }

  @GrpcMethod('ReactionService', 'UpVote')
  async upVote(args: VoteArgs) {
    try {
      const target = await this.reactionService.gets({ ids: [args.targetId] })
      target[0].upVote.push(args.userId)
      return await this.reactionService.update({ _id: args.targetId , upVote: target[0].upVote})
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new RpcException({
          code: status.NOT_FOUND,
        });
      }
    }
  }

  @GrpcMethod('ReactionService', 'DownVote')
  async downVote(args: VoteArgs) {
    try {
      const target = await this.reactionService.gets({ ids: [args.targetId] })
      target[0].downVote.push(args.userId)
      return await this.reactionService.update({ _id: args.targetId , downVote: target[0].downVote})
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new RpcException({
          code: status.NOT_FOUND,
        });
      }
    }
  }
}