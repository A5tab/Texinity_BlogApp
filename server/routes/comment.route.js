import { Router } from "express"
import { addComment, deleteComment, getBlogComments, updateComment } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"
const commentRouter = Router();

commentRouter.route("/add-comment").post(authMiddleware, addComment);
commentRouter.route("/delete-comment/:commentId").delete(authMiddleware, deleteComment);
commentRouter.route("/update-comment").put(authMiddleware, updateComment);
commentRouter.route("/get-blog-comments/:blogId").get(authMiddleware, getBlogComments);

export default commentRouter;
