import { CreatePost, EditPost,
         DeletePost, GetPost } from "../controllers/postController.js";
import { validateCreatePostSchema,
         validateDeletePost } from "../middlewares/postMiddleware.js";
import express from "express";

const router = express.Router();

router.post('/timeline', validateCreatePostSchema, CreatePost);
router.get('/timeline', GetPost);
router.post('/timeline/:id', validateCreatePostSchema, EditPost);
router.delete('/timeline/:id', validateDeletePost, DeletePost);

export default router;
