import express from "express";
import { repost, timeLine } from "../controllers/feedController.js";

const feedRouter = express.Router();

feedRouter.get('/timeline', timeLine );
feedRouter.post('/repost', repost);

export default feedRouter;
