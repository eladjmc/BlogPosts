"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = exports.updatePost = exports.getPost = exports.getPosts = exports.deletePost = exports.createPost = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
// Create a new post
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, author } = req.body;
        // Verify that the author exists
        const user = yield userModel_1.default.findById(author);
        if (!user) {
            res.status(404).json({ message: "Author not found" });
            return;
        }
        // Create the post
        const post = yield postModel_1.default.create({ title, content, author });
        // Add the post ID to the user's posts array
        user.posts.push(post._id);
        yield user.save();
        res.status(201).json(post);
    }
    catch (error) {
        next(error);
    }
});
exports.createPost = createPost;
// Delete a post
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.default.findByIdAndDelete(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        // Remove the post ID from the user's posts array
        yield userModel_1.default.findByIdAndUpdate(post.author, { $pull: { posts: post._id } });
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deletePost = deletePost;
// Get all posts
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find()
            .populate({
            path: "author",
            select: "username email profile",
        })
            .populate({
            path: "comments.author",
            select: "username email profile",
        });
        res.status(200).json(posts);
    }
    catch (error) {
        next(error);
    }
});
exports.getPosts = getPosts;
// Get a single post by ID
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.default.findById(req.params.id)
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
    }
    catch (error) {
        next(error);
    }
});
exports.getPost = getPost;
// Update a post
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield postModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
    }
    catch (error) {
        next(error);
    }
});
exports.updatePost = updatePost;
// Add a comment to a post
const addComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, author } = req.body;
        // Verify that the author exists
        const user = yield userModel_1.default.findById(author);
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
        const post = yield postModel_1.default.findByIdAndUpdate(req.params.id, { $push: { comments: comment } }, { new: true })
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
    }
    catch (error) {
        next(error);
    }
});
exports.addComment = addComment;
