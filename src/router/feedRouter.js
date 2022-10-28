import express from "express";
import { repost, timeLine, CreatePost } from "../controllers/feedController.js";
import { schemaValidation } from "../middlewares/SchemaValidation.js";
import { loggedUser } from "../middlewares/authMiddleware.js";
import { postSchema } from "../schema/postSchema.js";

const feedRouter = express.Router();

feedRouter.get('/timeline', timeLine );
feedRouter.post('/repost', repost);
feedRouter.post("/timeline", loggedUser, schemaValidation(postSchema), CreatePost);

export default feedRouter;