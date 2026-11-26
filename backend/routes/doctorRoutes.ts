/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

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
