import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './entities/article.entity';
import { Model } from 'mongoose';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ArticleDeletedEvent } from './events/article-deleted.event';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    author: AuthUser,
  ): Promise<Article> {
    const article = new this.articleModel({
      ...createArticleDto,
      author,
    });
    return article.save();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async findRecent(limit: number = 10, skip: number = 0): Promise<Article[]> {
    return this.articleModel
      .find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findByTag(
    tag: string,
    limit: number = 10,
    skip: number = 0,
  ): Promise<Article[]> {
    return this.articleModel
      .find({ tags: tag })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async remove(id: string): Promise<void> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) throw new NotFoundException('Article not found');
    await this.articleModel.findByIdAndDelete(id);
    this.eventEmitter.emit('article.deleted', new ArticleDeletedEvent(id));
  }

  async incrementCommentsCount(articleId: string): Promise<void> {
    const article = await this.articleModel.findByIdAndUpdate(articleId, {
      $inc: { commentsCount: 1 },
    });
    if (!article) throw new NotFoundException('Article not found');
  }

  async decrementCommentsCount(articleId: string): Promise<void> {
    await this.articleModel.findByIdAndUpdate(articleId, {
      $inc: { commentsCount: -1 },
    });
  }
}
