import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import PostController from "./router/postRouter.js";
import hashtagRouter from "./router/hashtagRouter.js";
import authRouter from "../src/router/authRouter.js";

const server = express();
server.use(cors());
server.use(express.json());
dotenv.config();

server.use(authRouter);
server.use(PostController);
server.use(hashtagRouter);

server.listen(process.env.PORT, () => {
  console.log(`Magic happens on ${process.env.PORT}`);
});
