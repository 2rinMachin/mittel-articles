import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  readonly content: string;

  @IsArray()
  readonly tags: string[];
}
