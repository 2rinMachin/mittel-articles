import { Injectable } from '@nestjs/common';
import { CommentsService } from '../comments.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ArticleDeletedEvent } from 'src/articles/events/article-deleted.event';

@Injectable()
export class ArticleDeletedListener {
  constructor(private readonly commentsService: CommentsService) {}

  @OnEvent('article.deleted')
  async handleArticleDeleted(event: ArticleDeletedEvent): Promise<void> {
    await this.commentsService.removeByArticle(event.articleId);
  }
}
