import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: IUser = await User.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating user", error:error.message || error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching users", error:error.message || error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate({
      path: "posts",
      populate: {
        path: "author",
        select: "username",
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching user", error:error.message || error });
  }
};

// Optionally, add DELETE and EDIT functions
