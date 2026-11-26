/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { Router } from "express";
import { contactController } from "../controllers/contactController";

const router = Router();

router.post("/", contactController.submitInquiry);
router.get("/", contactController.getInquiry);

export default router;
