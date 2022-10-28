import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from '../src/router/authRouter.js';
import PostRouter from "./router/postRouter.js"
import userRouter from  "./router/usersRouter.js"
import hashtagRouter from "./router/hashtagRouter.js";
import feedRouter from "./router/feedRouter.js";

const server = express();
server.use(cors());
server.use(express.json());
dotenv.config();

server.use(authRouter);
server.use(PostRouter);
server.use(userRouter);
server.use(hashtagRouter);
server.use(feedRouter)

server.listen(process.env.PORT, () => {
  console.log(`Magic happens on ${process.env.PORT}`);
});
