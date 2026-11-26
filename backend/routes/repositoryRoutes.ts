/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { Router } from "express";
import { repositoryController } from "../controllers/repositoryController";
import { authenticate } from "../middleware/auth";

const router = Router();

// All repository management endpoints are protected by authentication & admin checks
router.use(authenticate);

router.get("/metrics", repositoryController.getMetrics);
router.post("/sync", repositoryController.syncTraffic);
router.get("/activity", repositoryController.getActivity);
router.get("/audit", repositoryController.getAuditLogs);

export default router;
