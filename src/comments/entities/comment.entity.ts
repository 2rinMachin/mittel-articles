import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Article', required: true })
  postId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: {
      id: String,
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
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
