import { Router } from "express";
import { doctorController } from "../controllers/doctorController";
import { doctorProfileController } from "../controllers/doctorProfileController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", doctorController.getAll);
router.get("/specialties", doctorController.getSpecialties);
router.get("/profile", authenticate, doctorProfileController.getProfile);
router.patch("/profile", authenticate, doctorProfileController.updateProfile);
router.get("/verification-status", authenticate, doctorProfileController.getVerificationStatus);
router.get("/:id", doctorController.getById);

export default router;
