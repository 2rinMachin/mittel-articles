import { Injectable } from '@nestjs/common';
import { ArticlesService } from '../articles.service';
import { OnEvent } from '@nestjs/event-emitter';
import { CommentCreatedEvent } from 'src/comments/events/comment-created.event';
import { CommentDeletedEvent } from 'src/comments/events/comment-deleted.event';

@Injectable()
export class CommentsCounterListener {
  constructor(private readonly articlesService: ArticlesService) {}

  @OnEvent('comment.created')
  async handleCommentCreated(event: CommentCreatedEvent): Promise<void> {
    await this.articlesService.incrementCommentsCount(event.articleId);
  }

  @OnEvent('comment.deleted')
  async handleCommentDeleted(event: CommentDeletedEvent): Promise<void> {
    await this.articlesService.decrementCommentsCount(event.articleId);
  }
}
