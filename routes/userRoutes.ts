import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/userController";

const router = Router();

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/logout').get(signOut);


export default router;