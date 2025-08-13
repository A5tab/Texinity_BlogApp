import { Router } from "express";
import { toggleLike } from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const likeRouter = Router();

likeRouter.route("/toggle-like").post(authMiddleware, toggleLike);

export default likeRouter;
