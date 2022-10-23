import { userInfo, searchUsers } from "../controllers/usersController.js";
import { loggedUser } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/userImage",loggedUser,userInfo);
router.get("/users/:startsWith",loggedUser,searchUsers);

export default router;