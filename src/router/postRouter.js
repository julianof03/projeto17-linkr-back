import { CreatePost, EditPost,
         DeletePost, GetPost } from "../controllers/postController.js";
import { validateCreatePostSchema,
          } from "../middlewares/postMiddleware.js";
import { schemaValidation } from "../middlewares/SchemaValidation.js";
import { postSchema } from "../schema/postSchema.js";       
import express from "express";

const router = express.Router();

router.post('/timeline', schemaValidation(postSchema), CreatePost);
router.get('/timeline', GetPost);
router.post('/timeline/:id', validateCreatePostSchema, EditPost);
router.delete('/timeline/:id', validateCreatePostSchema, DeletePost);

export default router;
