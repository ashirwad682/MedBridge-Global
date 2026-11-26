import { Router } from "express";
import { patientController } from "../controllers/patientController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/profile", authenticate, patientController.getProfile);
router.patch("/profile", authenticate, patientController.updateProfile);

export default router;
