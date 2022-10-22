import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

import authRouter from '../src/router/authRouter.js';
import PostController from "./router/postRouter.js"


const server = express();
server.use(cors());
server.use(express.json());
dotenv.config()

server.use(authRouter);
server.use(PostController);


server.listen(process.env.PORT, () => {
    console.log(`Magic happens on ${process.env.PORT}`);
});

