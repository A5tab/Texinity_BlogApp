import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './options.js';

const app = express();
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



import usersRouter from './routes/user.route.js';
import blogsRouter from './routes/blog.route.js';
import commentsRouter from './routes/comment.route.js';
import followsRouter from './routes/follow.route.js';
import likesRouter from './routes/like.route.js';

app.use('/comments', commentsRouter);
app.use('/users', usersRouter);
app.use('/blogs', blogsRouter);
app.use('/follows', followsRouter)
app.use('/likes', likesRouter)


import { globalErrorHandler } from './middlewares/globalErrorHandler.middleware.js';
app.use(globalErrorHandler);



export { app }
