import { Router } from "express";
import { addUserAddress, deleteUser, deleteUserAddress, isAuth, resetPassword, sendResetPasswordEmail, signIn, signOut, signUp, updatePassword, updateProfile } from "../controllers/userController";
import { isAuthenticated } from "../middleware/auth";
// import multerUploads from "../middleware/multer";

const router = Router();
router.route('/me').get(isAuthenticated, isAuth);
router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/logout').get(signOut);
router.route('/me/password').put(isAuthenticated, updatePassword);
router.route('/me/update').put(isAuthenticated, updateProfile);
router.route('/me/address').post(isAuthenticated, addUserAddress);
router.route('/me/address').delete(isAuthenticated, deleteUserAddress);
router.route('/me').delete(isAuthenticated, deleteUser);

// Resetting Pass one for sending mail and second for new pass
router.route('/password/forgot').post(sendResetPasswordEmail);
router.route('/password/reset/:token').post(resetPassword);

// tests
// router.route('/testing').post(multerUploads, testingRoute)

export default router;