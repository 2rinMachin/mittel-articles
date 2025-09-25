import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from '../common/auth.guard';
import { AuthUser } from '../common/interfaces/auth-user.interface';

interface RequestWithUser extends Request {
  user: AuthUser;
}

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreateArticleDto, @Req() req: RequestWithUser) {
    return this.articlesService.create(dto, req.user);
  }

  @Get('recent')
  async findRecent(
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('skip', ParseIntPipe) skip: number = 0,
  ) {
    return this.articlesService.findRecent(limit, skip);
  }

  @Get('tag/:tag')
  async findByTag(
    @Param('tag') tag: string,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('skip', ParseIntPipe) skip: number = 0,
  ) {
    return this.articlesService.findByTag(tag, limit, skip);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(id, dto);
  }
}
