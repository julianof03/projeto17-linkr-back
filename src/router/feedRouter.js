import express from "express";
import { timeLine } from "../controllers/feedController.js";

const feedRouter = express.Router();

feedRouter.get('/timeline', timeLine );

export default feedRouter;
