import { Router } from "express";
import { authController } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/register/patient", authController.registerPatient);
router.post("/register/doctor", authController.registerDoctor);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.get("/me", authenticate, authController.getMe);
router.get("/session", authenticate, authController.getMe);
router.post("/logout", authController.logout);

export default router;
