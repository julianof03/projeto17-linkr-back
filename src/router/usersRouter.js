import { userInfo, searchUsers, unfollow, follow } from "../controllers/usersController.js";
import { loggedUser } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/userImage",loggedUser,userInfo);
router.get("/users:startsWith",loggedUser, searchUsers);
router.post("/follow",loggedUser,follow);
router.delete("/follow/:id",loggedUser,unfollow);

export default router;