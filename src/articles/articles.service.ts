import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './entities/article.entity';
import { Model } from 'mongoose';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
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
    return this.articleModel.find().sort({ _id: -1 }).skip(skip).limit(limit).exec();
  }

  async findByTag(tag: string, limit: number = 10, skip: number = 0): Promise<Article[]> {
    return this.articleModel.find({tags: tag}).sort({ _id: -1 }).skip(skip).limit(limit).exec();
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

  async remove(id: number): Promise<void> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) throw new NotFoundException('Article not found');
    await this.commentModel.deleteMany({ postId: article._id });
    await this.articleModel.findByIdAndDelete(id);
  }
}
