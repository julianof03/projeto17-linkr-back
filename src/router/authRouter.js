import { Router } from "express";

import { validateSignUp, validateSignIn, loggedUser } from '../middlewares/authMiddleware.js';
import { signUp, signIn, signOut } from "../controllers/authController.js";

const router = Router();

router.post("/signup", validateSignUp, signUp);
router.post("/signin", validateSignIn, signIn);
router.put("/signout",loggedUser,signOut);

export default router;