import express from "express";
import { getHashtagPosts, getTrendingHashtags} from "../controllers/hashtagController.js";
const router = express.Router();

router.get('/hashtag/:hashtag', getHashtagPosts);
router.get('/trending', getTrendingHashtags);


export default router;
