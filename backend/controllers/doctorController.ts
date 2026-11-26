import { Request, Response } from "express";
import { DOCTORS_DATA, SPECIALTIES_DATA, getDoctorById, getDoctorsBySpecialty } from "../services/medicalData";

export const doctorController = {
  getAll: (req: Request, res: Response): void => {
    const { specialty, search } = req.query;
    let doctors = [...DOCTORS_DATA];

    if (specialty && typeof specialty === "string") {
      doctors = getDoctorsBySpecialty(specialty);
    }

    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      doctors = doctors.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialtyName.toLowerCase().includes(q) ||
          doc.hospitalAffiliation.toLowerCase().includes(q) ||
          doc.bio.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: doctors.length, doctors });
  },

  getById: (req: Request, res: Response): void => {
    const { id } = req.params;
    const doctor = getDoctorById(id);

    if (!doctor) {
      res.status(404).json({ success: false, error: "Doctor not found" });
      return;
    }

    res.json({ success: true, doctor });
  },

  getSpecialties: (_req: Request, res: Response): void => {
    res.json({ success: true, specialties: Object.values(SPECIALTIES_DATA) });
  },
};

