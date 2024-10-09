import express from "express";
import dotenv from "dotenv";
import postRouter from "./routes/postRoutes";
import userRouter from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import connectDB from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blog_platform";

connectDB();

// Routes
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);


// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


