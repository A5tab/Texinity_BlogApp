import { Router } from "express";
import { getLoggedInUser, login, logout, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {authMiddleware} from '../middlewares/auth.middleware.js'
import {multerUpload} from "../middlewares/multer.middleware.js"

const userRouter = Router();

userRouter.route("/signup").post(multerUpload.single("avatar"), registerUser);
userRouter.route("/login").post(login);


userRouter.route("/get-loggedin-user").get(authMiddleware, getLoggedInUser);
userRouter.route("/logout").get(authMiddleware, logout);
userRouter.route("/refresh-access-token").get(refreshAccessToken);


export default userRouter;