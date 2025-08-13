import { Router } from 'express';
import { followUser, unFollowUser } from '../controllers/follow.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const followRouter = Router();

followRouter.route('/follow')
    .post(authMiddleware, followUser);

followRouter.route('/unfollow')
    .post(authMiddleware, unFollowUser);

export default followRouter;

