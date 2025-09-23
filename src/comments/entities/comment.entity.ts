import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Article', required: true })
  postId: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: {
      id: String,
      firstName: String,
      lastName: String,
      email: String,
    },
    required: true,
  })
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
