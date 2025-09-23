import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './entities/comment.entity';
import { Model } from 'mongoose';
import { ArticlesService } from 'src/articles/articles.service';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';
import { Article } from 'src/articles/entities/article.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    private readonly articlesService: ArticlesService,
  ) {}

  async create(createCommentDto: CreateCommentDto, author: AuthUser): Promise<Comment> {
    const article = await this.articlesService.findOne(createCommentDto.postId);
    if (!article) throw new NotFoundException('Article not found');
    const comment = new this.commentModel({
      ...createCommentDto,
      author,
    });
    await this.articleModel.findByIdAndUpdate(createCommentDto.postId, {
      $inc: { commentsCount: 1 },
    });
    return comment.save();
  }

  async findByArticle(postId: string, limit: number = 10, skip: number = 0) {
    return this.commentModel.find({ postId }).sort({ _id: -1 }).skip(skip).limit(limit).exec();
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true }).exec();
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async remove(id: string): Promise<void> {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    await this.commentModel.findByIdAndDelete(id);
    await this.articleModel.findByIdAndUpdate(comment.postId, {
      $inc: { commentsCount: -1 },
    });
  }
}
