import { Router } from "express";

import { validateSignUp, validateSignIn } from '../middlewares/authMiddleware.js';
import { signUp, signIn } from "../controllers/authController.js";

const router = Router();

router.post("/signup", validateSignUp, signUp);
router.post("/signin", validateSignIn, signIn);

export default router;