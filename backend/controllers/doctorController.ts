import { Request, Response } from "express";
import { DoctorProfile, Specialty } from "../models";

export const doctorController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const { specialty, search, limit = "100" } = req.query;

      const filter: Record<string, any> = {
        verificationStatus: "VERIFIED",
      };

      if (specialty && typeof specialty === "string" && specialty !== "all") {
        filter.specialtyId = specialty;
      }

      if (search && typeof search === "string") {
        const q = new RegExp(search, "i");
        filter.$or = [
          { name: q },
          { fullName: q },
          { specialtyName: q },
          { hospitalAffiliation: q },
          { hospitalOrClinic: q },
          { bio: q },
          { location: q },
        ];
      }

      const doctors = await DoctorProfile.find(filter)
        .sort({ rating: -1, reviewCount: -1 })
        .limit(parseInt(limit as string, 10))
        .lean();

      res.json({ success: true, count: doctors.length, doctors });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrieving doctors";
      res.status(500).json({ success: false, error: msg });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const query: Record<string, any> = { doctorId: id };

      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or = [{ doctorId: id }, { _id: id }];
        delete query.doctorId;
      }

      const doctor = await DoctorProfile.findOne(query).lean();

      if (!doctor) {
        res.status(404).json({ success: false, error: "Doctor not found" });
        return;
      }

      res.json({ success: true, doctor });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrieving doctor";
      res.status(500).json({ success: false, error: msg });
    }
  },

  getSpecialties: async (_req: Request, res: Response): Promise<void> => {
    try {
      const specialties = await Specialty.find().sort({ name: 1 }).lean();
      res.json({ success: true, count: specialties.length, specialties });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrieving specialties";
      res.status(500).json({ success: false, error: msg });
    }
  },
};
