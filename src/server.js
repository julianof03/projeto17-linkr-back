import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config()

import PostController from "./router/postRouter.js"
// import authRouters from './routers/authRouters.js';


const server = express();
server.use(cors());
server.use(express.json());

server.use(PostController);


server.listen(process.env.PORT, () => {
    console.log(`Magic happens on ${process.env.PORT}`);
});

