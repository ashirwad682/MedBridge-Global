import { Router } from "express";
import { appointmentController } from "../controllers/appointmentController";

const router = Router();

router.get("/slots", appointmentController.getSlots);
router.get("/", appointmentController.getAll);
router.post("/", appointmentController.book);
router.patch("/", appointmentController.cancel);
router.patch("/:id/cancel", appointmentController.cancel);

export default router;

