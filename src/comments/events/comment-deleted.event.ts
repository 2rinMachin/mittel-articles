import { Types } from 'mongoose';

export class CommentDeletedEvent {
  constructor(public readonly articleId: Types.ObjectId) {}
}
