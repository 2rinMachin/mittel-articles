import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  readonly postId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly content: string;
}
