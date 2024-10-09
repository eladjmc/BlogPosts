import { Request, Response, NextFunction } from "express";
import Post, { IPost } from "../models/postModel";
import User from "../models/userModel";

// Create a new post
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, author } = req.body;

    // Verify that the author exists
    const user = await User.findById(author);
    if (!user) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    // Create the post
    const post: IPost = await Post.create({ title, content, author });

    // Add the post ID to the user's posts array
    user.posts.push(post._id);
    await user.save();

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// Delete a post
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Remove the post ID from the user's posts array
    await User.findByIdAndUpdate(post.author, { $pull: { posts: post._id } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};



// Get all posts
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate({
        path: "author",
        select: "username email profile",
      })
      .populate({
        path: "comments.author",
        select: "username email profile",
      });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};


// Get a single post by ID
export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "author",
        select: "username email profile",
      })
      .populate({
        path: "comments.author",
        select: "username email profile",
      });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};


// Update a post
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate({
        path: "author",
        select: "username email profile",
      })
      .populate({
        path: "comments.author",
        select: "username email profile",
      });

    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};


// Add a comment to a post
export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content, author } = req.body;

    // Verify that the author exists
    const user = await User.findById(author);
    if (!user) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    // Create the comment object
    const comment = {
      content,
      author: user._id,
      createdAt: new Date(),
    };

    // Add the comment to the post
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate({
        path: "author",
        select: "username email profile",
      })
      .populate({
        path: "comments.author",
        select: "username email profile",
      });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};


