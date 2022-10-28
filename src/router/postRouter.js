import {
  CreatePost,       EditPost,
  DeletePost,       GetPost,
  GetPostByUserId,  getLikers,
  getAlertNewPosts, CreateRepost,
  GetComments,      InsertComment,
  updateLike,       updateDisLike
} from "../controllers/postController.js";
import { validateCreatePostSchema } from "../middlewares/postMiddleware.js";
import { schemaValidation } from "../middlewares/SchemaValidation.js";
import { postSchema } from "../schema/postSchema.js";
import { loggedUser } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/timeline", loggedUser, schemaValidation(postSchema), CreatePost);
router.get("/timeline", GetPost);

router.post("/timeline/:id", validateCreatePostSchema, EditPost);
router.delete("/timeline/:id", validateCreatePostSchema, DeletePost);

router.get('/timeline/:postId/comments/:userId', GetComments);
router.post('/timeline/:postId/comments', InsertComment);

router.get("/users/:id", loggedUser, GetPostByUserId);
router.post("/share", loggedUser, CreateRepost);
router.get("/timeline/getalertnewposts", getAlertNewPosts);

router.put("/timeline/likeUpdate", updateLike);
router.put("/timeline/dislikeUpdate", updateDisLike);
router.get("/likes/:postId",loggedUser, getLikers)

export default router;
