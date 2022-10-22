import express from "express";
import { getHashtagPosts} from "../controllers/hashtagController.js";
const router = express.Router();

router.get('/hashtag/:hashtag', getHashtagPosts);


export default router;
