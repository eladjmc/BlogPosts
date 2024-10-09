import mongoose, { Schema, Document, Types } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  profile: {
    bio?: string;
    socialLinks?: string[];
  };
  posts: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username cannot exceed 30 characters"],
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function (value: string) {
        return validator.isEmail(value);
      },
      message: "Please provide a valid email address",
    },
  },
  
  profile: {
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    socialLinks: [
      {
        type: String,
        validate: {
          validator: (value: string) => validator.isURL(value),
          message: "Please provide a valid URL",
        },
      },
    ],
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export default mongoose.model<IUser>("User", UserSchema);
