import { Router } from "express";
import { doctorController } from "../controllers/doctorController";

const router = Router();

router.get("/", doctorController.getAll);
router.get("/specialties", doctorController.getSpecialties);
router.get("/:id", doctorController.getById);

export default router;

