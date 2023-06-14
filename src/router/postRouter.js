import {
  EditPost, DeletePost,
  GetPostByUserId,  updateLike,
  getLikers,
  getAlertNewPosts, CreateRepost,
  GetComments,      InsertComment,       
  updateDisLike
} from "../controllers/postController.js";
import { validateCreatePostSchema } from "../middlewares/postMiddleware.js";
import { loggedUser } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/timeline/:id", validateCreatePostSchema, EditPost);
router.delete("/timeline/:id", loggedUser,validateCreatePostSchema, DeletePost);

router.get('/timeline/:postId/comments/:userId', GetComments);
router.post('/timeline/:postId/comments', InsertComment);

router.get("/users/:id", loggedUser, GetPostByUserId);
router.post("/share", loggedUser, CreateRepost);
router.get("/timeline/getalertnewposts", getAlertNewPosts);

router.put("/timeline/likeUpdate", updateLike);
router.put("/timeline/dislikeUpdate", updateDisLike);
router.get("/likes/:postId",loggedUser, getLikers)

export default router;
