import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ashirwad682_db_user:QyvSLhPDx3uZWHe1@omnicareglobal.xzijral.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "medbridge";

console.log("Connecting to MongoDB Atlas:", MONGODB_DB_NAME);

async function run() {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log("Connected to MongoDB Atlas!");

  // Read medical-data.ts to extract doctors and specialties
  const medDataRaw = fs.readFileSync(path.resolve(__dirname, "../apps/web/lib/medical-data.ts"), "utf8");

  // Define Mongoose models
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
    education: String,
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
    { upsert: true, new: true }
  );

  // 2. Parse specialties from medical-data.ts
  console.log("Seeding specialties...");
  const specialtiesMap = {
    "internal-medicine": { name: "Internal Medicine", icon: "Stethoscope" },
    "family-medicine": { name: "Family Medicine", icon: "Users" },
    "cardiology": { name: "Cardiology", icon: "HeartPulse" },
    "orthopedics": { name: "Orthopedics", icon: "Bone" },
    "neurology": { name: "Neurology", icon: "Brain" },
    "dermatology": { name: "Dermatology", icon: "Shield" },
    "pediatrics": { name: "Pediatrics", icon: "Baby" },
    "diagnostic-imaging": { name: "Diagnostic Imaging", icon: "Scan" },
  };

  for (const [sId, sMeta] of Object.entries(specialtiesMap)) {
    await Specialty.findOneAndUpdate(
      { specialtyId: sId },
      {
        specialtyId: sId,
        name: sMeta.name,
        description: `Comprehensive expert clinical care in ${sMeta.name}`,
        shortIntro: `Specialized diagnostics and evidence-based therapeutic programs in ${sMeta.name}.`,
        iconName: sMeta.icon,
        href: `/specialties/${sId}`,
      },
      { upsert: true, new: true }
    );
  }

  // 3. Extract doctors from medical-data.ts using regex
  console.log("Extracting and seeding all 28 doctors...");
  const docBlocks = medDataRaw.split(/\{\s*id:\s*\"dr-/g).slice(1);
  console.log(`Found ${docBlocks.length} doctor blocks`);

  let docIndex = 0;
  for (const block of docBlocks) {
    const extract = (field) => {
      const regex = new RegExp(`${field}:\\s*[\"']([^\"']+)[\"']`);
      const m = block.match(regex);
      return m ? m[1] : "";
    };

    const extractArray = (field) => {
      const regex = new RegExp(`${field}:\\s*\\[([^\\]]+)\\]`);
      const m = block.match(regex);
      if (!m) return [];
      return m[1].split(",").map(s => s.trim().replace(/[\"']/g, "")).filter(Boolean);
    };

    const extractNum = (field) => {
      const regex = new RegExp(`${field}:\\s*([0-9.]+)`);
      const m = block.match(regex);
      return m ? parseFloat(m[1]) : 0;
    };

    const id = "dr-" + extract("id") || `dr-doc-${docIndex}`;
    const name = extract("name") || "Physician";
    const specialtyId = extract("specialtyId") || "internal-medicine";
    const specialtyName = extract("specialtyName") || "Internal Medicine";
    const role = extract("role") || "Medical Specialist";
    const experience = extract("experience") || "12 years";
    const rating = extractNum("rating") || 4.9;
    const reviewCount = extractNum("reviewCount") || 100;
    const image = extract("image") || "/images/doctors/marcus-chen.png";
    const education = extract("education") || "MD, Board Certified";
    const hospitalAffiliation = extract("hospitalAffiliation") || "MedBridge Specialist Hospital";
    const languages = extractArray("languages");
    const consultationFee = extract("consultationFee") || "$200";
    const bio = extract("bio") || `${name} is a leading specialist in ${specialtyName}.`;
    const location = extract("location") || "New York, NY";
    const availableDays = extractArray("availableDays");
    const availableHours = extract("availableHours") || "09:00 AM - 05:00 PM";

    const email = id === "dr-julian-thorne" ? "doctor@medbridge.com" : `${id}@medbridge.com`;

    let docUser = await User.findOne({ email });
    if (!docUser) {
      docUser = await User.create({
        fullName: name,
        email,
        phone: "+1 (555) 019-2831",
        passwordHash: defaultPasswordHash,
        role: "DOCTOR",
        isEmailVerified: true,
        isActive: true,
      });
    }

    await DoctorProfile.findOneAndUpdate(
      { doctorId: id },
      {
        userId: docUser._id,
        doctorId: id,
        name,
        fullName: name,
        specialtyId,
        specialtyName,
        roleTitle: role,
        specialization: specialtyName,
        medicalRegistrationNumber: `MED-REG-${id.toUpperCase().replace("DR-", "")}-2026`,
        qualifications: [education],
        education,
        experience,
        yearsOfExperience: parseInt(experience) || 12,
        hospitalAffiliation,
        hospitalOrClinic: hospitalAffiliation,
        consultationFee,
        rating,
        reviewCount,
        image,
        profileImage: image,
        bio,
        location,
        languages: languages.length ? languages : ["English"],
        availableDays: availableDays.length ? availableDays : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableHours,
        isAcceptingNewPatients: true,
        isVerified: true,
        verificationStatus: "VERIFIED",
        verifiedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    docIndex++;
  }

  // Update specialty counts
  for (const sId of Object.keys(specialtiesMap)) {
    const count = await DoctorProfile.countDocuments({ specialtyId: sId });
    await Specialty.findOneAndUpdate({ specialtyId: sId }, { doctorCount: count });
  }

  // 4. Seed Medical Records for patient
  console.log("Seeding medical records...");
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
      { upsert: true, new: true }
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
    { upsert: true, new: true }
  );

  const finalDocCount = await DoctorProfile.countDocuments();
  const finalUserCount = await User.countDocuments();
  const finalAptCount = await Appointment.countDocuments();
  const finalSpecCount = await Specialty.countDocuments();

  console.log(`\n🎉 Seed completed!`);
  console.log(`- Doctors in MongoDB: ${finalDocCount}`);
  console.log(`- Users in MongoDB: ${finalUserCount}`);
  console.log(`- Appointments in MongoDB: ${finalAptCount}`);
  console.log(`- Specialties in MongoDB: ${finalSpecCount}`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
