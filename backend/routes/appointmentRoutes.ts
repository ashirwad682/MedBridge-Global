/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { Router } from "express";
import { appointmentController } from "../controllers/appointmentController";

const router = Router();

router.get("/slots", appointmentController.getSlots);
router.get("/", appointmentController.getAll);
router.post("/", appointmentController.book);
router.patch("/", appointmentController.cancel);
router.patch("/:id/cancel", appointmentController.cancel);

export default router;

