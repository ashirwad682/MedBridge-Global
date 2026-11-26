/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { Router } from "express";
import { patientController } from "../controllers/patientController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/profile", authenticate, patientController.getProfile);
router.patch("/profile", authenticate, patientController.updateProfile);

export default router;
