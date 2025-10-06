import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './entities/comment.entity';
import { Model, Types } from 'mongoose';
import { ArticlesService } from 'src/articles/articles.service';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';
import { CommentCreatedEvent } from './events/comment-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentDeletedEvent } from './events/comment-deleted.event';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly articlesService: ArticlesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    author: AuthUser,
  ): Promise<Comment> {
    const article = await this.articlesService.findOne(createCommentDto.postId);
    if (!article) throw new NotFoundException('Article not found');
    const comment = new this.commentModel({
      ...createCommentDto,
      postId: new Types.ObjectId(createCommentDto.postId),
      author,
    });
    await comment.save();
    this.eventEmitter.emit(
      'comment.created',
      new CommentCreatedEvent(comment.postId),
    );
    return comment;
  }

  async findByArticle(postId: string, limit: number = 10, skip: number = 0) {
    return this.commentModel
      .find({ postId: new Types.ObjectId(postId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: AuthUser,
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.author.id !== user.id) {
      throw new UnauthorizedException('You are not the author of this comment');
    }

    comment.content = updateCommentDto.content ?? comment.content;
    return comment.save();
  }

  async remove(id: string, user: AuthUser): Promise<void> {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.author.id !== user.id) {
      throw new UnauthorizedException('You are not the author of this comment');
    }

    await this.commentModel.findByIdAndDelete(id);
    this.eventEmitter.emit(
      'comment.deleted',
      new CommentDeletedEvent(comment.postId),
    );
  }

  async removeByArticle(articleId: string): Promise<void> {
    await this.commentModel.deleteMany({ postId: articleId });
  }
}
