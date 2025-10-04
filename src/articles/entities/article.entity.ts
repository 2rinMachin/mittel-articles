import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({
    type: {
      id: { type: String, required: true },
      username: String,
      email: String,
    },
    required: true,
  })
  author: {
    id: string;
    username: string;
    email: string;
  };

  @Prop({ default: 0 })
  commentsCount: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
