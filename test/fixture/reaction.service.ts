import { Observable } from 'rxjs';
import { Reaction } from '../../src/reaction/reaction.schema';
import { CreateReactionArgs, GetReactionsArgs, ReactionId, VoteArgs } from '../../src/reaction/reaction.dto';

export interface ReactionService {
  createReaction(payload: CreateReactionArgs): Observable<Reaction>;
  getReactions(payload: GetReactionsArgs): Observable<Reaction>;
  deleteReaction(payload: ReactionId): Observable<Reaction>;
  upVote(payload: VoteArgs): Observable<Reaction>;
}