import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Put,
  Req,
  UseGuards,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '../common/auth.guard';
import { AuthUser } from '../common/interfaces/auth-user.interface';
import { Comment } from './entities/comment.entity';

interface RequestWithUser extends Request {
  user: AuthUser;
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() dto: CreateCommentDto,
    @Req() req: RequestWithUser,
  ): Promise<Comment> {
    return this.commentsService.create(dto, req.user);
  }

  @Get('post/:postId')
  async findByArticle(
    @Param('postId') postId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
  ): Promise<Comment[]> {
    return this.commentsService.findByArticle(postId, limit, skip);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.commentsService.remove(id);
  }
}
