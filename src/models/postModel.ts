import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment {
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: Types.ObjectId;
  comments: IComment[];
}

const CommentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: [true, "Comment content is required"],
    minlength: [1, "Comment cannot be empty"],
    maxlength: [1000, "Comment cannot exceed 1000 characters"],
  },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    minlength: [10, "Content must be at least 10 characters long"],
  },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comments: [CommentSchema],
});


export default mongoose.model<IPost>("Post", PostSchema);
