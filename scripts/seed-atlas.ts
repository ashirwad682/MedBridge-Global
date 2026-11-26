import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { DOCTORS_DATA, SPECIALTIES_DATA } from "../apps/web/lib/medical-data";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medbridge";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "medbridge";

console.log("Connecting to MongoDB Atlas:", MONGODB_DB_NAME);

async function run() {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log("Connected to MongoDB Atlas!");

  const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: String,
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["PATIENT", "DOCTOR", "ADMIN"], required: true },
    isEmailVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  }, { timestamps: true });

  const DoctorProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    specialtyId: { type: String, required: true, index: true },
    specialtyName: { type: String, required: true },
    roleTitle: String,
    specialization: String,
    medicalRegistrationNumber: String,
    qualifications: [String],
    education: mongoose.Schema.Types.Mixed,
    experience: String,
    yearsOfExperience: Number,
    hospitalAffiliation: String,
    hospitalOrClinic: String,
    consultationFee: mongoose.Schema.Types.Mixed,
    rating: Number,
    reviewCount: Number,
    image: String,
    profileImage: String,
    bio: String,
    location: String,
    languages: [String],
    availableDays: [String],
    availableHours: String,
    isAcceptingNewPatients: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
    verificationStatus: { type: String, default: "VERIFIED" },
    verifiedAt: Date,
  }, { timestamps: true });

  const PatientProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    dateOfBirth: String,
    gender: String,
    address: String,
    emergencyContact: String,
    bloodGroup: String,
    allergies: [String],
    medicalHistory: String,
  }, { timestamps: true });

  const AppointmentSchema = new mongoose.Schema({
    bookingReference: { type: String, required: true, unique: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorSlug: { type: String, index: true },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true, lowercase: true, index: true },
    patientPhone: { type: String, required: true },
    doctorName: String,
    specialtyId: { type: String, required: true, index: true },
    specialtyName: { type: String, required: true },
    appointmentDate: { type: String, required: true, index: true },
    appointmentTime: { type: String, required: true },
    consultationType: { type: String, default: "IN_PERSON" },
    status: { type: String, default: "CONFIRMED", index: true },
    reason: String,
    notes: String,
    cancellationReason: String,
  }, { timestamps: true });

  const ContactInquirySchema = new mongoose.Schema({
    ticketId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: String,
    department: { type: String, default: "general" },
    urgency: { type: String, default: "routine" },
    preferredContactMethod: { type: String, default: "email" },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "NEW", index: true },
  }, { timestamps: true });

  const MedicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    recordType: { type: String, required: true },
    doctorName: String,
    facility: String,
    documentUrl: String,
    status: { type: String, default: "NORMAL" },
    notes: String,
  }, { timestamps: true });

  const SpecialtySchema = new mongoose.Schema({
    specialtyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    shortIntro: String,
    conditionsSubtitle: String,
    conditions: [String],
    services: [{ title: String, description: String, image: String }],
    iconName: String,
    href: String,
    doctorCount: Number,
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const DoctorProfile = mongoose.models.DoctorProfile || mongoose.model("DoctorProfile", DoctorProfileSchema);
  const PatientProfile = mongoose.models.PatientProfile || mongoose.model("PatientProfile", PatientProfileSchema);
  const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
  const ContactInquiry = mongoose.models.ContactInquiry || mongoose.model("ContactInquiry", ContactInquirySchema);
  const MedicalRecord = mongoose.models.MedicalRecord || mongoose.model("MedicalRecord", MedicalRecordSchema);
  const Specialty = mongoose.models.Specialty || mongoose.model("Specialty", SpecialtySchema);

  const defaultPasswordHash = await bcrypt.hash("password123", 10);

  // 1. Seed demo patient
  console.log("Seeding patient user...");
  let patientUser = await User.findOne({ email: "patient@medbridge.com" });
  if (!patientUser) {
    patientUser = await User.create({
      fullName: "Alex Morgan",
      email: "patient@medbridge.com",
      phone: "+1 (555) 234-5678",
      passwordHash: defaultPasswordHash,
      role: "PATIENT",
      isEmailVerified: true,
      isActive: true,
    });
  }

  await PatientProfile.findOneAndUpdate(
    { userId: patientUser._id },
    {
      userId: patientUser._id,
      dateOfBirth: "1988-06-14",
      gender: "Male",
      address: "450 Lexington Avenue, Suite 1200, New York, NY 10017",
      emergencyContact: "+1 (555) 999-0000",
      bloodGroup: "O+",
      allergies: ["Penicillin", "Dust Mites"],
      medicalHistory: "Mild hypertension controlled by lifestyle; seasonal allergic rhinitis.",
    },
    { upsert: true }
  );

  // 2. Seed Specialties
  console.log("Seeding specialties from SPECIALTIES_DATA...");
  for (const [key, spec] of Object.entries(SPECIALTIES_DATA)) {
    const doctorCount = DOCTORS_DATA.filter((d) => d.specialtyId === spec.id).length;
    await Specialty.findOneAndUpdate(
      { specialtyId: spec.id },
      {
        specialtyId: spec.id,
        name: spec.name,
        description: spec.shortIntro,
        shortIntro: spec.shortIntro,
        conditionsSubtitle: spec.conditionsSubtitle,
        conditions: spec.conditions.map((c) => c.name),
        services: spec.services.map((s) => ({
          title: s.title,
          description: s.description,
          image: s.image,
        })),
        iconName: spec.id === "cardiology" ? "HeartPulse" : spec.id === "neurology" ? "Brain" : "Activity",
        href: `/specialties/${spec.id}`,
        doctorCount,
      },
      { upsert: true }
    );
  }

  // 3. Clear existing DoctorProfile and seed all 28 doctors cleanly
  console.log(`Seeding all ${DOCTORS_DATA.length} doctors into MongoDB...`);
  await DoctorProfile.deleteMany({});

  for (const doc of DOCTORS_DATA) {
    const email = doc.id === "dr-julian-thorne" ? "doctor@medbridge.com" : `${doc.id}@medbridge.com`;

    let docUser = await User.findOne({ email });
    if (!docUser) {
      docUser = await User.create({
        fullName: doc.name,
        email,
        phone: "+1 (555) 019-2831",
        passwordHash: defaultPasswordHash,
        role: "DOCTOR",
        isEmailVerified: true,
        isActive: true,
      });
    }

    await DoctorProfile.create({
      userId: docUser._id,
      doctorId: doc.id,
      name: doc.name,
      fullName: doc.name,
      specialtyId: doc.specialtyId,
      specialtyName: doc.specialtyName,
      roleTitle: doc.role,
      specialization: doc.specialtyName,
      medicalRegistrationNumber: `MED-REG-${doc.id.toUpperCase().replace("DR-", "")}-2026`,
      qualifications: Array.isArray(doc.education) ? doc.education : [doc.education || "MD, Board Certified"],
      education: doc.education,
      experience: doc.experience,
      yearsOfExperience: parseInt(doc.experience) || 12,
      hospitalAffiliation: doc.hospitalAffiliation,
      hospitalOrClinic: doc.hospitalAffiliation,
      consultationFee: doc.consultationFee,
      rating: doc.rating,
      reviewCount: doc.reviewCount,
      image: doc.image,
      profileImage: doc.image,
      bio: doc.bio,
      location: doc.location,
      languages: doc.languages,
      availableDays: doc.availableDays,
      availableHours: doc.availableHours,
      isAcceptingNewPatients: true,
      isVerified: true,
      verificationStatus: "VERIFIED",
      verifiedAt: new Date(),
    });
  }

  // 4. Seed Medical Records for patient
  console.log("Seeding patient medical records...");
  await MedicalRecord.deleteMany({ patientId: patientUser._id });
  await MedicalRecord.create([
    {
      patientId: patientUser._id,
      title: "Complete Blood Count & Comprehensive Metabolic Panel",
      recordType: "LAB_REPORT",
      doctorName: "Dr. Sarah Thorne, MD",
      facility: "MedBridge Central Diagnostic Laboratory",
      documentUrl: "/records/cbc-panel-2026.pdf",
      status: "NORMAL",
      notes: "All parameters within normal therapeutic ranges. Fasting glucose: 88 mg/dL, HbA1c: 5.2%.",
    },
    {
      patientId: patientUser._id,
      title: "2D Echocardiogram & Doppler Vascular Analysis",
      recordType: "SCAN",
      doctorName: "Dr. Marcus Chen, MD, FACC",
      facility: "Columbia University Irving Medical Center, New York",
      documentUrl: "/records/echo-doppler-2026.pdf",
      status: "VERIFIED",
      notes: "Left ventricular ejection fraction: 62%. Normal wall motion and valvular flow dynamics.",
    },
    {
      patientId: patientUser._id,
      title: "Dermatological Biopsy & Skin Pathology Assessment",
      recordType: "CONSULTATION_NOTE",
      doctorName: "Dr. Ritu Agarwal, MD",
      facility: "MedBridge Specialist Network",
      documentUrl: "/records/derm-biopsy-2026.pdf",
      status: "NORMAL",
      notes: "Benign dermal melanocytic nevus. No atypia or dysplasia observed.",
    },
  ]);

  // 5. Seed Appointments
  console.log("Seeding appointments...");
  const sampleAppointments = [
    {
      bookingReference: "MBG-2026-8812",
      patientId: patientUser._id,
      patientName: "Alex Morgan",
      patientEmail: "patient@medbridge.com",
      patientPhone: "+1 (555) 234-5678",
      doctorSlug: "dr-marcus-chen",
      doctorName: "Dr. Marcus Chen, MD, FACC",
      specialtyId: "cardiology",
      specialtyName: "Cardiology",
      appointmentDate: "2026-12-05",
      appointmentTime: "10:30 AM",
      consultationType: "IN_PERSON",
      status: "CONFIRMED",
      reason: "Routine preventive cardiology checkup and calcium score review.",
    },
    {
      bookingReference: "MBG-2026-9077",
      patientId: patientUser._id,
      patientName: "Alex Morgan",
      patientEmail: "patient@medbridge.com",
      patientPhone: "+1 (555) 234-5678",
      doctorSlug: "dr-julian-thorne",
      doctorName: "Dr. Julian Thorne, MD",
      specialtyId: "internal-medicine",
      specialtyName: "Internal Medicine",
      appointmentDate: "2026-12-02",
      appointmentTime: "11:00 AM",
      consultationType: "IN_PERSON",
      status: "CONFIRMED",
      reason: "Comprehensive annual health review and preventative metabolic monitoring.",
    },
    {
      bookingReference: "MBG-2026-9043",
      patientName: "Meera Kapoor",
      patientEmail: "meera.kapoor@example.com",
      patientPhone: "+1 (555) 456-7890",
      doctorSlug: "dr-julian-thorne",
      doctorName: "Dr. Julian Thorne, MD",
      specialtyId: "internal-medicine",
      specialtyName: "Internal Medicine",
      appointmentDate: "2026-12-02",
      appointmentTime: "02:30 PM",
      consultationType: "IN_PERSON",
      status: "CONFIRMED",
      reason: "Metabolic workup discussion and preventative treatment reconciliation.",
    },
    {
      bookingReference: "MBG-2026-9122",
      patientName: "Ananya Roy",
      patientEmail: "ananya.roy@example.com",
      patientPhone: "+1 (555) 345-6789",
      doctorSlug: "dr-julian-thorne",
      doctorName: "Dr. Julian Thorne, MD",
      specialtyId: "internal-medicine",
      specialtyName: "Internal Medicine",
      appointmentDate: "2026-12-03",
      appointmentTime: "09:30 AM",
      consultationType: "IN_PERSON",
      status: "PENDING",
      reason: "Cardiovascular risk factor evaluation and biomarker monitoring.",
    },
  ];

  for (const apt of sampleAppointments) {
    await Appointment.findOneAndUpdate(
      { bookingReference: apt.bookingReference },
      apt,
      { upsert: true }
    );
  }

  // 6. Seed Contact Inquiry
  console.log("Seeding contact inquiry...");
  await ContactInquiry.findOneAndUpdate(
    { ticketId: "MBG-CNT-2026-INIT1" },
    {
      ticketId: "MBG-CNT-2026-INIT1",
      name: "Devon Vance",
      email: "devon.vance@example.com",
      phone: "+1 (555) 888-7777",
      department: "specialist",
      urgency: "routine",
      preferredContactMethod: "email",
      subject: "Interventional Cardiology Network Inquiry",
      message: "Requesting details regarding clinical referral pathways for transcatheter aortic valve procedures.",
      status: "RESPONDED",
    },
    { upsert: true }
  );

  const finalDocCount = await DoctorProfile.countDocuments();
  const finalUserCount = await User.countDocuments();
  const finalAptCount = await Appointment.countDocuments();
  const finalSpecCount = await Specialty.countDocuments();
  const finalMedRecords = await MedicalRecord.countDocuments();
  const finalInquiries = await ContactInquiry.countDocuments();

  console.log(`\n🎉 Seed completed!`);
  console.log(`- Doctors in MongoDB: ${finalDocCount}`);
  console.log(`- Users in MongoDB: ${finalUserCount}`);
  console.log(`- Appointments in MongoDB: ${finalAptCount}`);
  console.log(`- Specialties in MongoDB: ${finalSpecCount}`);
  console.log(`- Medical Records in MongoDB: ${finalMedRecords}`);
  console.log(`- Contact Inquiries in MongoDB: ${finalInquiries}`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
