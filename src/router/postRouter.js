import { CreatePost, EditPost,
         DeletePost, GetPost } from "../controllers/postController.js";
import { validateCreatePostSchema } from "../middlewares/postMiddleware.js";
import express from "express";

const router = express.Router();

router.post('/timeline', validateCreatePostSchema, CreatePost);
router.get('/timeline', GetPost);
router.post('/timeline/:id', EditPost);
router.delete('/timeline/:id', DeletePost);

export default router;
