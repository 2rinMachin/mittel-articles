import { Types } from 'mongoose';

export class CommentCreatedEvent {
  constructor(public readonly articleId: Types.ObjectId) {}
}
