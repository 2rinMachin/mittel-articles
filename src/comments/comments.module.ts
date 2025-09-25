import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './entities/comment.entity';
import { ArticleDeletedListener } from './listeners/article-deleted.listener';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    ArticlesModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, ArticleDeletedListener],
})
export class CommentsModule {}
