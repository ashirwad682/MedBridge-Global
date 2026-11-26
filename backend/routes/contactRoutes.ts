import { Router } from "express";
import { contactController } from "../controllers/contactController";

const router = Router();

router.post("/", contactController.submitInquiry);
router.get("/", contactController.getInquiry);

export default router;
