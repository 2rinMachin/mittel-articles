import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './entities/article.entity';
import { FilterQuery, Model } from 'mongoose';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ArticleDeletedEvent } from './events/article-deleted.event';
import { SearchArticlesDto } from './dto/search-articles.dto';

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

  async searchArticles(dto: SearchArticlesDto): Promise<Article[]> {
    const query: FilterQuery<Article> = {};

    if (dto.title) {
      query.title = { $regex: dto.title, $options: 'i' };
    }

    if (dto.tag) {
      query.tags = dto.tag;
    }

    return this.articleModel
      .find(query)
      .sort({ _id: -1 })
      .skip(dto.skip)
      .limit(dto.limit)
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
