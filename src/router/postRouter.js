import { CreatePost, EditPost,
         DeletePost, GetPost,
          GetPostByUserId, GetComments} from "../controllers/postController.js";
import { validateCreatePostSchema } from "../middlewares/postMiddleware.js";
import { schemaValidation } from "../middlewares/SchemaValidation.js";
import { postSchema } from "../schema/postSchema.js";  
import { loggedUser } from "../middlewares/authMiddleware.js";     
import express from "express";

const router = express.Router();

router.post('/timeline', loggedUser, schemaValidation(postSchema), CreatePost);
router.get('/timeline',GetPost);
router.post('/timeline/:id', validateCreatePostSchema, EditPost);
router.delete('/timeline/:id', validateCreatePostSchema, DeletePost);
router.get('/timeline/:postId/comments', GetComments);
router.get("/users/:id",/* loggedUser, */ GetPostByUserId);



export default router;
