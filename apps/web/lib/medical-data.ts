export interface SpecialtyCondition {
  name: string;
  description: string;
  image: string;
}

export interface SpecialtyService {
  title: string;
  description: string;
  image: string;
}

export interface SpecialtyStat {
  value: string;
  label: string;
}

export interface SpecialtyFAQ {
  question: string;
  answer: string;
}

export interface SpecialtyData {
  id: string;
  name: string;
  label: string;
  shortIntro: string;
  heroImage: string;
  heroAlt: string;
  conditionsSubtitle: string;
  conditions: SpecialtyCondition[];
  services: SpecialtyService[];
  stats: SpecialtyStat[];
  faqs: SpecialtyFAQ[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  image: string;
  qualifications: string[];
  experienceYears: number;
  availability: string;
  rating: number;
  reviewsCount: number;
  languages: string[];
  hospitalAffiliation: string;
  consultationFee: string;
  bio: string;
  education: string[];
  areasOfExpertise: string[];
}

export interface AppointmentRecord {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  specialtyId: string;
  specialtyName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export function mapDbDoctorToDoctor(doc: any): Doctor {
  const edu = Array.isArray(doc.education)
    ? doc.education
    : typeof doc.education === "string"
      ? [doc.education]
      : Array.isArray(doc.qualifications)
        ? doc.qualifications
        : ["MD, Board Certified"];

  const quals = Array.isArray(doc.qualifications)
    ? doc.qualifications
    : typeof doc.education === "string"
      ? [doc.education]
      : ["MD"];

  const expertise = Array.isArray(doc.areasOfExpertise)
    ? doc.areasOfExpertise
    : Array.isArray(doc.specializations)
      ? doc.specializations
      : [doc.specialtyName || "General Specialist Consultation"];

  const expYears =
    typeof doc.experienceYears === "number"
      ? doc.experienceYears
      : typeof doc.yearsOfExperience === "number"
        ? doc.yearsOfExperience
        : parseInt(String(doc.experience || "10"), 10) || 10;

  return {
    id: doc.doctorId || doc.id,
    name: doc.name || doc.fullName,
    title: doc.roleTitle || doc.title || doc.specialization || "Specialist Physician",
    specialtyId: doc.specialtyId,
    specialtyName: doc.specialtyName,
    image: doc.image || doc.profileImage || "/images/doctors/marcus-chen.png",
    qualifications: quals,
    experienceYears: expYears,
    availability: doc.availableHours || doc.availability || "Mon – Fri: 09:00 AM – 05:00 PM",
    rating: doc.rating || 4.9,
    reviewsCount: doc.reviewCount || doc.reviewsCount || 100,
    languages: Array.isArray(doc.languages) ? doc.languages : ["English"],
    hospitalAffiliation: doc.hospitalAffiliation || doc.hospitalOrClinic || "MedBridge Specialist Network",
    consultationFee: doc.consultationFee || "$200",
    bio: doc.bio || "",
    education: edu,
    areasOfExpertise: expertise,
  };
}

export const SPECIALTIES_DATA: Record<string, SpecialtyData> = {
  "internal-medicine": {
    id: "internal-medicine",
    name: "Internal Medicine",
    label: "INTERNAL MEDICINE",
    shortIntro:
      "Comprehensive adult healthcare coordinating preventive diagnosis, complex chronic disease management, and long-term wellness.",
    heroImage: "/images/specialty-hero-internal-medicine.webp",
    heroAlt: "Female physician consulting with an adult patient in a modern clinical room",
    conditionsSubtitle:
      "Targeted diagnosis and ongoing management for acute and chronic adult health conditions.",
    conditions: [
      {
        name: "Diabetes & Metabolic Health",
        description: "Personalized glycemic balance, insulin therapy, and continuous glucose tracking.",
        image: "/images/condition-diabetes.webp",
      },
      {
        name: "Heart & Vascular Health",
        description: "Blood pressure stabilization, arterial assessment, and preventive cardiovascular care.",
        image: "/images/condition-cardio.webp",
      },
      {
        name: "Thyroid & Hormone Balance",
        description: "Comprehensive endocrine panels for Hashimoto's, hypothyroidism, and adrenal wellness.",
        image: "/images/condition-thyroid.webp",
      },
      {
        name: "Kidney Health & Function",
        description: "Early renal protection strategies, electrolyte balancing, and metabolic preservation.",
        image: "/images/condition-kidney.webp",
      },
      {
        name: "Digestive & Gastrointestinal Care",
        description: "Clinical evaluation for acid reflux, microbiome health, and IBS management.",
        image: "/images/condition-digestive.webp",
      },
      {
        name: "Autoimmune & Inflammatory Conditions",
        description: "Multisystem differential diagnosis and modern immune-modulating treatment plans.",
        image: "/images/condition-autoimmune.webp",
      },
    ],
    services: [
      {
        title: "Comprehensive Health Checkups",
        description: "Thorough multi-organ baseline screening with integrated biometric risk calculations.",
        image: "/images/service-checkups.webp",
      },
      {
        title: "Chronic Disease Management",
        description: "Synchronized care plans for hypertension, metabolic health, and medication reconciliation.",
        image: "/images/service-chronic-care.webp",
      },
      {
        title: "Preventive Health Screening",
        description: "Advanced lipid subfractions, vascular calcium scoring, and cancer surveillance.",
        image: "/images/service-screening.webp",
      },
      {
        title: "Diagnostic Consultations",
        description: "In-depth evaluations for complex symptoms, persistent fatigue, and second opinions.",
        image: "/images/service-diagnostic.webp",
      },
    ],
    stats: [
      { value: "15+", label: "Years Avg Experience" },
      { value: "98.4%", label: "Patient Satisfaction" },
      { value: "Same-Week", label: "Consultation Access" },
      { value: "100%", label: "Digital Health Records" },
    ],
    faqs: [
      {
        question: "Can an internist act as my primary care doctor?",
        answer: "Yes, internists specialize in adult primary care, managing routine wellness as well as complex chronic health conditions.",
      },
      {
        question: "What should I bring to my first consultation?",
        answer: "Bring a list of current medications, prior diagnostic reports or lab results, and your medical history notes.",
      },
    ],
  },

  "family-medicine": {
    id: "family-medicine",
    name: "Family Medicine",
    label: "FAMILY MEDICINE",
    shortIntro:
      "Continuous, compassionate healthcare tailored for every generation of your family from infancy through mature adulthood.",
    heroImage: "/images/specialty-hero-family-medicine.webp",
    heroAlt: "Family doctor consulting with parents and child in a warm modern clinic",
    conditionsSubtitle:
      "Comprehensive medical care addressing acute needs and preventive health for all ages.",
    conditions: [
      {
        name: "Acute Infections & Illnesses",
        description: "Rapid relief and diagnosis for fevers, respiratory infections, and seasonal bugs.",
        image: "/images/condition-digestive.webp",
      },
      {
        name: "Child & Adolescent Development",
        description: "Pediatric growth charting, milestone reviews, and school athletic physicals.",
        image: "/images/condition-autoimmune.webp",
      },
      {
        name: "Asthma & Environmental Allergies",
        description: "Trigger isolation, inhaler management, and long-term pulmonary support.",
        image: "/images/condition-cardio.webp",
      },
      {
        name: "Joint Strains & Minor Injuries",
        description: "Orthopedic triage, sprain recovery, and safe rehabilitation protocols.",
        image: "/images/condition-kidney.webp",
      },
      {
        name: "Routine Dermatological Care",
        description: "Skin wellness checkups, eczema therapy, and minor in-office cryotherapy.",
        image: "/images/condition-thyroid.webp",
      },
      {
        name: "Healthy Aging & Geriatric Support",
        description: "Mobility preservation, memory wellness, and prescription safety reviews.",
        image: "/images/condition-diabetes.webp",
      },
    ],
    services: [
      {
        title: "Well-Child & Family Physicals",
        description: "Full health assessments, developmental milestones, and age-graded immunizations.",
        image: "/images/service-checkups.webp",
      },
      {
        title: "Rapid Sick-Visit Consultations",
        description: "Priority same-day appointment access for sudden symptoms, flu, and infections.",
        image: "/images/service-diagnostic.webp",
      },
      {
        title: "Lifelong Preventive Screenings",
        description: "Family risk profiling, blood pressure monitoring, and coordinated cancer screenings.",
        image: "/images/service-screening.webp",
      },
      {
        title: "Women's & Men's Health Care",
        description: "Dedicated wellness examinations, reproductive consultations, and hormone health.",
        image: "/images/service-chronic-care.webp",
      },
    ],
    stats: [
      { value: "All Ages", label: "Care Coverage" },
      { value: "99.1%", label: "Family Retention" },
      { value: "< 24hr", label: "Urgent Access" },
      { value: "4.95 / 5", label: "Average Rating" },
    ],
    faqs: [
      {
        question: "Can my whole family visit the same physician?",
        answer: "Yes, family doctors are uniquely trained to care for infants, children, adults, and seniors under one coordinated roof.",
      },
    ],
  },

  "cardiology": {
    id: "cardiology",
    name: "Cardiology",
    label: "CARDIOLOGY",
    shortIntro:
      "Advanced cardiovascular evaluations, non-invasive imaging, and preventive vascular care for lifelong heart health.",
    heroImage: "/images/specialty-hero-cardiology.webp",
    heroAlt: "Cardiologist examining heart diagnostics and monitors in an advanced clinic",
    conditionsSubtitle:
      "Specialized clinical diagnosis and therapy for coronary, rhythm, and vascular conditions.",
    conditions: [
      {
        name: "Coronary Artery Health",
        description: "Early plaque detection, ischemia evaluation, and preventive arterial therapy.",
        image: "/images/condition-cardio.webp",
      },
      {
        name: "Heart Rhythm & Arrhythmias",
        description: "Atrial fibrillation management, ambulatory patch monitoring, and stroke prevention.",
        image: "/images/condition-diabetes.webp",
      },
      {
        name: "Hypertension & Vascular Strain",
        description: "Endothelial function analysis and tailored multi-agent blood pressure regimens.",
        image: "/images/condition-kidney.webp",
      },
      {
        name: "Heart Failure & Cardiomyopathy",
        description: "Neurohormonal therapy, ejection fraction monitoring, and symptom control.",
        image: "/images/condition-thyroid.webp",
      },
      {
        name: "Valvular Heart Conditions",
        description: "Echocardiographic monitoring for aortic stenosis, mitral regurgitation, and repairs.",
        image: "/images/condition-autoimmune.webp",
      },
      {
        name: "Preventive Lipid Disorders",
        description: "Advanced ApoB and Lp(a) analysis to stop atherosclerosis before events happen.",
        image: "/images/condition-digestive.webp",
      },
    ],
    services: [
      {
        title: "High-Resolution Echocardiography",
        description: "Clear ultrasound visualization of heart chambers, blood flow, and valve dynamics.",
        image: "/images/service-diagnostic.webp",
      },
      {
        title: "Cardiopulmonary Stress Testing",
        description: "Treadmill and pharmacologic stress evaluations for coronary flow and stamina.",
        image: "/images/service-checkups.webp",
      },
      {
        title: "Continuous Digital Holter Tracking",
        description: "Extended wireless patch monitors tracking intermittent palpitations and arrhythmias.",
        image: "/images/service-screening.webp",
      },
      {
        title: "Preventive Cardiometabolic Care",
        description: "Personalized arterial wellness roadmaps, lifestyle optimization, and statin management.",
        image: "/images/service-chronic-care.webp",
      },
    ],
    stats: [
      { value: "24-48h", label: "ECG Turnaround" },
      { value: "99.4%", label: "Diagnostic Accuracy" },
      { value: "5,000+", label: "Echo Studies Reviewed" },
      { value: "Top 1%", label: "Cardiology Specialists" },
    ],
    faqs: [
      {
        question: "When should I consult a cardiologist?",
        answer: "If you experience chest tightness, shortness of breath, unexplained palpitations, dizziness, or have a family history of early heart disease.",
      },
    ],
  },

  "orthopedics": {
    id: "orthopedics",
    name: "Orthopedics",
    label: "ORTHOPEDICS",
    shortIntro:
      "Expert musculoskeletal restoration, minimally invasive arthroscopy, and motion-preserving joint therapies.",
    heroImage: "/images/specialty-hero-orthopedics.webp",
    heroAlt: "Orthopedic doctor consulting with a patient regarding joint mobility",
    conditionsSubtitle:
      "Restoring pain-free movement through non-surgical and precision surgical therapies.",
    conditions: [
      {
        name: "Knee & Hip Osteoarthritis",
        description: "Cartilage preservation, viscosupplementation, and joint reconstruction.",
        image: "/images/condition-kidney.webp",
      },
      {
        name: "Rotator Cuff & Shoulder Pain",
        description: "Tendon pathology assessment, targeted injections, and mobility recovery.",
        image: "/images/condition-cardio.webp",
      },
      {
        name: "ACL & Meniscus Ligament Tears",
        description: "Precision MRI correlation, sports injury repair, and accelerated recovery.",
        image: "/images/condition-autoimmune.webp",
      },
      {
        name: "Spinal & Lower Back Pain",
        description: "Non-operative decompression, facet joint injections, and core stabilization.",
        image: "/images/condition-digestive.webp",
      },
      {
        name: "Sports Fractures & Tendinitis",
        description: "Achilles tendinitis, tennis elbow, and structured return-to-sport programs.",
        image: "/images/condition-diabetes.webp",
      },
      {
        name: "Hand & Carpal Tunnel Syndrome",
        description: "Nerve conduction testing, custom splinting, and endoscopic release procedures.",
        image: "/images/condition-thyroid.webp",
      },
    ],
    services: [
      {
        title: "Ultrasound-Guided Injections",
        description: "Precision PRP, hyaluronic acid, and corticosteroid delivery directly into joint spaces.",
        image: "/images/service-diagnostic.webp",
      },
      {
        title: "Sports Injury Rehabilitation",
        description: "Biomechanical gait analysis, joint bracing, and synchronized physical therapy.",
        image: "/images/service-checkups.webp",
      },
      {
        title: "Minimally Invasive Arthroscopy",
        description: "Keyhole surgical techniques for knee, shoulder, and ankle tendon restorations.",
        image: "/images/service-screening.webp",
      },
      {
        title: "Total & Partial Joint Replacement",
        description: "Modern robotic-assisted hip and knee arthroplasty with accelerated discharge.",
        image: "/images/service-chronic-care.webp",
      },
    ],
    stats: [
      { value: "96.8%", label: "Non-Surgical Recovery" },
      { value: "4.92 / 5", label: "Patient Mobility Score" },
      { value: "Fast", label: "Direct MRI Scheduling" },
      { value: "Top Tier", label: "Orthopedic Fellowships" },
    ],
    faqs: [
      {
        question: "Do I always need surgery for joint pain?",
        answer: "No. Over 85% of orthopedic conditions respond successfully to non-surgical treatment including targeted injections, physical therapy, and lifestyle guidance.",
      },
    ],
  },

  "neurology": {
    id: "neurology",
    name: "Neurology",
    label: "NEUROLOGY",
    shortIntro:
      "Advanced clinical neuroscience treating migraines, neurovascular conditions, memory health, and peripheral nerves.",
    heroImage: "/images/specialty-hero-neurology.webp",
    heroAlt: "Neurologist reviewing a high-resolution brain scan in a modern medical suite",
    conditionsSubtitle:
      "Precise neurological diagnostics and modern therapies supporting brain health and mobility.",
    conditions: [
      {
        name: "Chronic Migraines & Headaches",
        description: "FDA-approved Botox protocols, CGRP antagonists, and preventive headache care.",
        image: "/images/condition-thyroid.webp",
      },
      {
        name: "Memory & Cognitive Vitality",
        description: "Standardized neurocognitive testing, biomarker review, and brain health planning.",
        image: "/images/condition-diabetes.webp",
      },
      {
        name: "Parkinson's & Tremor Disorders",
        description: "Dopaminergic balance, movement disorder diagnostics, and physical support.",
        image: "/images/condition-autoimmune.webp",
      },
      {
        name: "Peripheral Neuropathy & Sciatica",
        description: "EMG nerve conduction mapping, numbness relief, and nerve protection.",
        image: "/images/condition-kidney.webp",
      },
      {
        name: "Epilepsy & Seizure Care",
        description: "Ambulatory EEG evaluations and optimized modern anticonvulsant regimens.",
        image: "/images/condition-cardio.webp",
      },
      {
        name: "Neurovascular & Stroke Prevention",
        description: "Carotid Doppler flow assessments and systemic antiplatelet optimization.",
        image: "/images/condition-digestive.webp",
      },
    ],
    services: [
      {
        title: "Electromyography (EMG) Diagnostics",
        description: "Advanced electrical nerve mapping for radiculopathy, carpal tunnel, and myopathies.",
        image: "/images/service-diagnostic.webp",
      },
      {
        title: "Therapeutic Migraine Injections",
        description: "Targeted Botox and peripheral nerve blocks for rapid, long-lasting relief.",
        image: "/images/service-checkups.webp",
      },
      {
        title: "Neurocognitive Assessments",
        description: "Multi-point diagnostic batteries evaluating memory, processing, and executive function.",
        image: "/images/service-screening.webp",
      },
      {
        title: "Vascular Neurological Reviews",
        description: "Comprehensive intracranial and carotid Doppler screening for stroke prevention.",
        image: "/images/service-chronic-care.webp",
      },
    ],
    stats: [
      { value: "98.7%", label: "Diagnostic Specificity" },
      { value: "100%", label: "Subspecialty Trained" },
      { value: "< 5 Days", label: "Consultation Access" },
      { value: "4.94 / 5", label: "Patient Care Score" },
    ],
    faqs: [
      {
        question: "What happens during a neurological consultation?",
        answer: "A neurologist assesses cranial nerves, reflexes, balance, sensory perception, and cognitive response in a comfortable, non-invasive examination.",
      },
    ],
  },

  "dermatology": {
    id: "dermatology",
    name: "Dermatology",
    label: "DERMATOLOGY",
    shortIntro:
      "Expert medical and surgical dermatology safeguarding skin health through precision dermoscopy and tailored therapies.",
    heroImage: "/images/specialty-hero-dermatology.webp",
    heroAlt: "Dermatologist examining a patient's skin with advanced dermascope in a serene clinic",
    conditionsSubtitle:
      "Clinical evaluations and modern dermatologic therapies for healthy, resilient skin.",
    conditions: [
      {
        name: "Skin Cancer & Atypical Moles",
        description: "High-magnification polarized dermoscopy, mole mapping, and early melanoma screening.",
        image: "/images/condition-thyroid.webp",
      },
      {
        name: "Severe Adult & Teen Acne",
        description: "Targeted topical regimens, hormonal therapies, and barrier-safe treatments.",
        image: "/images/condition-diabetes.webp",
      },
      {
        name: "Eczema & Atopic Dermatitis",
        description: "Barrier repair protocols, modern biologics, and non-steroidal topical therapies.",
        image: "/images/condition-autoimmune.webp",
      },
      {
        name: "Psoriasis & Scalp Care",
        description: "Systemic immunomodulators, phototherapy coordination, and scalp relief.",
        image: "/images/condition-digestive.webp",
      },
      {
        name: "Hair Loss & Scalp Disorders",
        description: "Trichoscopic scalp imaging, hormone panels, and regenerative hair solutions.",
        image: "/images/condition-cardio.webp",
      },
      {
        name: "Allergic Contact Rashes",
        description: "Hypoallergenic patch testing, barrier restoration, and soothing treatments.",
        image: "/images/condition-kidney.webp",
      },
    ],
    services: [
      {
        title: "Full-Body Digital Skin Screenings",
        description: "High-definition dermoscopic documentation tracking mole changes over time.",
        image: "/images/service-screening.webp",
      },
      {
        title: "Precision In-Office Skin Biopsies",
        description: "Minimally scarring shave and punch biopsies with prompt pathology turnaround.",
        image: "/images/service-diagnostic.webp",
      },
      {
        title: "Advanced Biologic Infusions",
        description: "Targeted molecular therapies for refractory psoriasis, eczema, and urticaria.",
        image: "/images/service-chronic-care.webp",
      },
      {
        title: "Medical Barrier Rehabilitation",
        description: "Customized dermatologic formulations tailored to individual skin microclimates.",
        image: "/images/service-checkups.webp",
      },
    ],
    stats: [
      { value: "10,000+", label: "Exams Completed" },
      { value: "Same-Day", label: "Pathology Submission" },
      { value: "4.97 / 5", label: "Patient Rating" },
      { value: "Top Tier", label: "Board Certification" },
    ],
    faqs: [
      {
        question: "How often should I get a full skin check?",
        answer: "We recommend an annual full-body skin exam, or sooner if you notice changes in size, shape, or color of any mole.",
      },
    ],
  },

  "pediatrics": {
    id: "pediatrics",
    name: "Pediatrics",
    label: "PEDIATRICS",
    shortIntro:
      "Gentle, family-centered medical care dedicated to childhood milestones, adolescent health, and bright futures.",
    heroImage: "/images/specialty-hero-pediatrics.webp",
    heroAlt: "Pediatrician gently interacting with a child and reassuring parents in a friendly clinic",
    conditionsSubtitle:
      "Compassionate, age-appropriate medical support for infants, children, and teens.",
    conditions: [
      {
        name: "Newborn Care & Feeding Support",
        description: "Early growth tracking, gentle weight monitoring, and parent reassurance.",
        image: "/images/condition-autoimmune.webp",
      },
      {
        name: "Childhood Fevers & Ear Infections",
        description: "Gentle otoscopy, rapid strep testing, and cautious antibiotic stewardship.",
        image: "/images/condition-digestive.webp",
      },
      {
        name: "Pediatric Asthma & Allergies",
        description: "Child-friendly spacer training, seasonal asthma plans, and trigger reduction.",
        image: "/images/condition-cardio.webp",
      },
      {
        name: "Developmental Milestone Tracking",
        description: "Motor skill milestones, speech acquisition reviews, and supportive guidance.",
        image: "/images/condition-diabetes.webp",
      },
      {
        name: "Childhood Eczema & Skin Care",
        description: "Fragrance-free barrier creams, gentle bathing advice, and itch relief.",
        image: "/images/condition-thyroid.webp",
      },
      {
        name: "Adolescent Health & Wellness",
        description: "Sports physicals, sleep optimization, and confidential teen guidance.",
        image: "/images/condition-kidney.webp",
      },
    ],
    services: [
      {
        title: "Well-Child Developmental Exams",
        description: "Comprehensive checks ensuring physical, cognitive, and social milestones are met.",
        image: "/images/service-checkups.webp",
      },
      {
        title: "Gentle Childhood Immunizations",
        description: "CDC-recommended vaccine schedules administered with warmth and minimal stress.",
        image: "/images/service-screening.webp",
      },
      {
        title: "Same-Day Urgent Sick Care",
        description: "Prompt access for unexpected fevers, earaches, stomach aches, and coughs.",
        image: "/images/service-diagnostic.webp",
      },
      {
        title: "School & Sports Physical Clearances",
        description: "Complete pre-participation physical assessments with official documentation.",
        image: "/images/service-chronic-care.webp",
      },
    ],
    stats: [
      { value: "0 to 18", label: "Years Covered" },
      { value: "99.6%", label: "Parent Trust Score" },
      { value: "Gentle", label: "Care Atmosphere" },
      { value: "Same-Day", label: "Sick Care Access" },
    ],
    faqs: [
      {
        question: "How do you keep sick and well children separate?",
        answer: "Our pediatric facilities feature separate waiting zones and swift exam room check-ins to safeguard infant health.",
      },
    ],
  },

  "diagnostic-imaging": {
    id: "diagnostic-imaging",
    name: "Diagnostic Imaging",
    label: "DIAGNOSTIC IMAGING",
    shortIntro:
      "High-precision MRI, CT, ultrasound, and digital radiography delivering fast, crystal-clear diagnostic reporting.",
    heroImage: "/images/specialty-hero-diagnostic-imaging.webp",
    heroAlt: "Radiologist reviewing high-resolution medical imaging scans on dual diagnostic monitors",
    conditionsSubtitle:
      "Advanced non-invasive imaging clarifying clinical conditions with exceptional accuracy.",
    conditions: [
      {
        name: "Joint & Ligament Tears",
        description: "High-contrast MRI evaluation for meniscus, ACL, and rotator cuff injuries.",
        image: "/images/condition-kidney.webp",
      },
      {
        name: "Brain & Spine Scans",
        description: "Diffusion-weighted MRI for neurovascular clarity and spinal disc assessments.",
        image: "/images/condition-thyroid.webp",
      },
      {
        name: "Abdominal & Pelvic Diagnostics",
        description: "Multi-phase CT and ultrasound evaluations for internal organs and kidneys.",
        image: "/images/condition-digestive.webp",
      },
      {
        name: "Thoracic & Lung Evaluations",
        description: "Low-dose chest CT scanning for respiratory nodules and pulmonary wellness.",
        image: "/images/condition-cardio.webp",
      },
      {
        name: "Vascular Doppler Imaging",
        description: "Non-invasive hemodynamic blood flow evaluations for carotid and limb arteries.",
        image: "/images/condition-diabetes.webp",
      },
      {
        name: "Bone Fractures & Skeletal Scans",
        description: "Instant low-radiation digital radiography for immediate bone assessment.",
        image: "/images/condition-autoimmune.webp",
      },
    ],
    services: [
      {
        title: "High-Field Magnetic Resonance (MRI)",
        description: "Wide-bore, quiet scanners delivering exceptional tissue contrast and patient comfort.",
        image: "/images/service-diagnostic.webp",
      },
      {
        title: "Low-Dose Multi-Slice CT Scanning",
        description: "Ultra-fast volumetric acquisitions adhering strictly to ALARA safety protocols.",
        image: "/images/service-screening.webp",
      },
      {
        title: "Diagnostic Ultrasound & Doppler",
        description: "High-frequency acoustic imaging of soft tissues, abdominal organs, and vascular flow.",
        image: "/images/service-checkups.webp",
      },
      {
        title: "Direct Physician-to-Physician Reports",
        description: "Rapid written evaluations delivered directly to your attending specialist in 24 hours.",
        image: "/images/service-chronic-care.webp",
      },
    ],
    stats: [
      { value: "< 24hr", label: "Report Turnaround" },
      { value: "100%", label: "Board-Certified Radiologists" },
      { value: "Low-Dose", label: "ALARA Radiation Safety" },
      { value: "Direct", label: "Digital Image Sharing" },
    ],
    faqs: [
      {
        question: "When will my physician receive my imaging results?",
        answer: "Preliminary urgent findings are communicated immediately. Final written diagnostic reports are shared with your doctor within 12 to 24 hours.",
      },
    ],
  },
};

export const DOCTORS_DATA: Doctor[] = [
  {
    id: "dr-evelyn-vance",
    name: "Dr. Evelyn Vance, MD, FACP",
    title: "Lead Internist & Diagnostic Specialist",
    specialtyId: "internal-medicine",
    specialtyName: "Internal Medicine",
    image: "/images/doc-internal-dr-vance.webp",
    qualifications: ["MD - Johns Hopkins University", "Residency - Massachusetts General Hospital", "Fellow, American College of Physicians"],
    experienceYears: 16,
    availability: "Mon, Wed, Fri (In-Person & Telehealth)",
    rating: 4.9,
    reviewsCount: 184,
    languages: ["English", "French"],
    hospitalAffiliation: "MedBridge Global Health Pavilion",
    consultationFee: "$180",
    bio: "Dr. Evelyn Vance has over 16 years of clinical excellence in diagnostic internal medicine and chronic disease management. She focuses on complex multisystem conditions, preventative cardiovascular health, and personalized wellness roadmaps.",
    education: [
      "MD, Johns Hopkins University School of Medicine",
      "Internal Medicine Residency, Massachusetts General Hospital / Harvard Medical School",
      "Board Certified, American Board of Internal Medicine",
    ],
    areasOfExpertise: ["Diagnostic Dilemmas", "Metabolic Syndrome", "Hypertension", "Preventive Longevity"],
  },
  {
    id: "dr-julian-thorne",
    name: "Dr. Julian Thorne, MD",
    title: "Consultant Physician in Internal Medicine",
    specialtyId: "internal-medicine",
    specialtyName: "Internal Medicine",
    image: "/images/doc-internal-dr-thorne.webp",
    qualifications: ["MD - Columbia University", "Residency - NewYork-Presbyterian Hospital", "Diplomate, American Board of Internal Medicine"],
    experienceYears: 12,
    availability: "Tue, Thu, Sat (In-Person)",
    rating: 4.8,
    reviewsCount: 142,
    languages: ["English", "Spanish"],
    hospitalAffiliation: "MedBridge Global Health Pavilion",
    consultationFee: "$165",
    bio: "Dr. Julian Thorne provides empathetic and data-driven primary care for adults. His practice integrates continuous glucose monitoring, cardiovascular risk stratification, and patient-centered lifestyle medicine.",
    education: [
      "MD, Columbia University Vagelos College of Physicians and Surgeons",
      "Residency, NewYork-Presbyterian / Weill Cornell Medical Center",
      "Board Certified, American Board of Internal Medicine",
    ],
    areasOfExpertise: ["Preventive Health", "Diabetes Management", "Lipid Disorders", "Adult Vaccinations"],
  },
  {
    id: "dr-sofia-rivera",
    name: "Dr. Sofia Rivera, MD, FAAFP",
    title: "Director of Family & Community Medicine",
    specialtyId: "family-medicine",
    specialtyName: "Family Medicine",
    image: "/images/doc-family-dr-rivera.webp",
    qualifications: ["MD - Stanford University School of Medicine", "Residency - UCSF Family Medicine", "Fellow, American Academy of Family Physicians"],
    experienceYears: 14,
    availability: "Mon, Tue, Wed, Thu (In-Person & Telehealth)",
    rating: 4.95,
    reviewsCount: 220,
    languages: ["English", "Spanish", "Portuguese"],
    hospitalAffiliation: "MedBridge Family Health Center",
    consultationFee: "$150",
    bio: "Dr. Sofia Rivera provides multi-generational healthcare, caring for patients from childhood through elder years. She believes in treating the whole family with warmth, preventative guidance, and culturally sensitive medical care.",
    education: [
      "MD, Stanford University School of Medicine",
      "Residency in Family Medicine, University of California, San Francisco (UCSF)",
      "Board Certified, American Board of Family Medicine",
    ],
    areasOfExpertise: ["Whole-Family Care", "Well-Woman Exams", "Adolescent Health", "Preventative Immunization"],
  },
  {
    id: "dr-marcus-chen",
    name: "Dr. Marcus Chen, MD, FACC",
    title: "Chief of Cardiovascular Medicine",
    specialtyId: "cardiology",
    specialtyName: "Cardiology",
    image: "/images/doc-cardio-dr-chen.webp",
    qualifications: ["MD - Harvard Medical School", "Fellowship - Brigham and Women's Hospital", "Fellow, American College of Cardiology"],
    experienceYears: 18,
    availability: "Mon, Wed, Thu (In-Person)",
    rating: 4.98,
    reviewsCount: 310,
    languages: ["English", "Mandarin"],
    hospitalAffiliation: "MedBridge Heart & Vascular Institute",
    consultationFee: "$220",
    bio: "Dr. Marcus Chen is an internationally recognized cardiologist specializing in preventative cardiology, coronary plaque evaluation, and cardiac imaging. He is passionate about halting atherosclerosis through personalized lifestyle and pharmacotherapy.",
    education: [
      "MD, Harvard Medical School",
      "Internal Medicine Residency, Brigham and Women's Hospital",
      "Cardiovascular Disease Fellowship, Brigham and Women's Hospital",
      "Board Certified, Cardiovascular Disease & Echocardiography",
    ],
    areasOfExpertise: ["Coronary Artery Disease", "Echocardiography", "Preventative Lipids", "Heart Failure"],
  },
  {
    id: "dr-rachel-adams",
    name: "Dr. Rachel Adams, MD",
    title: "Consultant Cardiologist & Heart Rhythm Specialist",
    specialtyId: "cardiology",
    specialtyName: "Cardiology",
    image: "/images/doc-cardio-dr-adams.webp",
    qualifications: ["MD - Penn Medicine", "Fellowship - Cleveland Clinic Cardiology", "Board Certified in Cardiovascular Disease"],
    experienceYears: 11,
    availability: "Tue, Thu, Fri (In-Person & Telehealth)",
    rating: 4.9,
    reviewsCount: 168,
    languages: ["English"],
    hospitalAffiliation: "MedBridge Heart & Vascular Institute",
    consultationFee: "$200",
    bio: "Dr. Rachel Adams specializes in cardiac arrhythmias, atrial fibrillation management, and syncope evaluations. She utilizes modern ambulatory patch monitors to accurately diagnose intermittent palpitations and fainting spells.",
    education: [
      "MD, Perelman School of Medicine at University of Pennsylvania",
      "Internal Medicine Residency, Hospital of the University of Pennsylvania",
      "Cardiovascular Fellowship, Cleveland Clinic",
      "Board Certified, Cardiovascular Disease",
    ],
    areasOfExpertise: ["Atrial Fibrillation", "Arrhythmia Monitoring", "Palpitation Workup", "Vascular Wellness"],
  },
  {
    id: "dr-david-marcus",
    name: "Dr. David Marcus, MD, FAAOS",
    title: "Director of Orthopedic Surgery & Sports Medicine",
    specialtyId: "orthopedics",
    specialtyName: "Orthopedics",
    image: "/images/doc-ortho-dr-marcus.webp",
    qualifications: ["MD - Duke University School of Medicine", "Fellowship - Hospital for Special Surgery (HSS)", "Fellow, American Academy of Orthopaedic Surgeons"],
    experienceYears: 17,
    availability: "Mon, Tue, Thu (In-Person)",
    rating: 4.92,
    reviewsCount: 245,
    languages: ["English"],
    hospitalAffiliation: "MedBridge Orthopedic & Spine Pavilion",
    consultationFee: "$210",
    bio: "Dr. David Marcus is a fellowship-trained orthopedic surgeon specializing in knee and hip preservation, joint reconstruction, and athletic injuries. He champions minimally invasive surgical procedures and motion-sparing rehab plans.",
    education: [
      "MD, Duke University School of Medicine",
      "Orthopedic Surgery Residency, Duke University Medical Center",
      "Adult Reconstruction & Sports Medicine Fellowship, Hospital for Special Surgery",
      "Board Certified, American Board of Orthopaedic Surgery",
    ],
    areasOfExpertise: ["Knee & Hip Arthroplasty", "ACL Reconstruction", "Rotator Cuff Repair", "PRP Joint Injections"],
  },
  {
    id: "dr-helena-blake",
    name: "Dr. Helena Blake, MD",
    title: "Consultant Orthopedic Surgeon & Joint Preservation Specialist",
    specialtyId: "orthopedics",
    specialtyName: "Orthopedics",
    image: "/images/doc-ortho-dr-blake.webp",
    qualifications: ["MD - Yale School of Medicine", "Residency - Mayo Clinic Orthopedics", "Board Certified in Orthopedic Surgery"],
    experienceYears: 13,
    availability: "Wed, Fri, Sat (In-Person)",
    rating: 4.88,
    reviewsCount: 156,
    languages: ["English", "German"],
    hospitalAffiliation: "MedBridge Orthopedic & Spine Pavilion",
    consultationFee: "$195",
    bio: "Dr. Helena Blake focuses on shoulder, elbow, and knee arthroscopy. She advocates non-operative regenerative protocols whenever viable, restoring painless movement for active professionals and recreational athletes.",
    education: [
      "MD, Yale School of Medicine",
      "Orthopedic Surgery Residency, Mayo Clinic",
      "Sports Medicine Fellowship, Rush University Medical Center",
      "Board Certified, American Board of Orthopaedic Surgery",
    ],
    areasOfExpertise: ["Shoulder Arthroscopy", "Meniscus Repair", "Tendonitis Recovery", "Ultrasound-Guided Injections"],
  },
  {
    id: "dr-alexander-hayes",
    name: "Dr. Alexander Hayes, MD, PhD",
    title: "Head of Neurological Sciences",
    specialtyId: "neurology",
    specialtyName: "Neurology",
    image: "/images/doc-neuro-dr-alex.webp",
    qualifications: ["MD, PhD - UCLA David Geffen School of Medicine", "Fellowship - UCSF Movement Disorders", "Diplomate, American Board of Psychiatry & Neurology"],
    experienceYears: 19,
    availability: "Mon, Wed (In-Person & Telehealth)",
    rating: 4.96,
    reviewsCount: 290,
    languages: ["English"],
    hospitalAffiliation: "MedBridge Brain & Spine Institute",
    consultationFee: "$230",
    bio: "Dr. Alexander Hayes combines clinical neurology with neuroscience research. He specializes in neurodegenerative conditions, cognitive preservation, Parkinson's disease, and neurovascular health.",
    education: [
      "MD, PhD, UCLA David Geffen School of Medicine",
      "Neurology Residency, UCSF Medical Center",
      "Clinical Neurophysiology Fellowship, UCSF",
      "Board Certified, American Board of Psychiatry and Neurology",
    ],
    areasOfExpertise: ["Cognitive Decline", "Parkinson's Disease", "Stroke Prevention", "EMG Diagnostics"],
  },
  {
    id: "dr-grace-kim",
    name: "Dr. Grace Kim, MD",
    title: "Consultant Neurologist & Headache Specialist",
    specialtyId: "neurology",
    specialtyName: "Neurology",
    image: "/images/doc-neuro-dr-kim.webp",
    qualifications: ["MD - Northwestern University Feinberg School of Medicine", "Residency - NYU Langone Health", "Certified in Headache Medicine (UCNS)"],
    experienceYears: 10,
    availability: "Tue, Thu, Fri (In-Person & Telehealth)",
    rating: 4.91,
    reviewsCount: 175,
    languages: ["English", "Korean"],
    hospitalAffiliation: "MedBridge Brain & Spine Institute",
    consultationFee: "$190",
    bio: "Dr. Grace Kim is dedicated to transforming lives through migraine and headache medicine. She offers Botox therapeutic injections, CGRP receptor antagonist protocols, and nerve blocks for chronic headache disorders.",
    education: [
      "MD, Northwestern University Feinberg School of Medicine",
      "Neurology Residency, NYU Langone Health",
      "Headache Medicine Fellowship, Jefferson Headache Center",
      "Board Certified in Neurology & Headache Medicine",
    ],
    areasOfExpertise: ["Chronic Migraine", "Botox for Migraine", "Neuropathic Pain", "Epilepsy Management"],
  },
  {
    id: "dr-maya-zheng",
    name: "Dr. Maya Zheng, MD, FAAD",
    title: "Director of Clinical & Surgical Dermatology",
    specialtyId: "dermatology",
    specialtyName: "Dermatology",
    image: "/images/doc-derma-dr-zheng.webp",
    qualifications: ["MD - Stanford University School of Medicine", "Residency - Harvard Dermatology", "Fellow, American Academy of Dermatology"],
    experienceYears: 15,
    availability: "Mon, Tue, Thu (In-Person)",
    rating: 4.97,
    reviewsCount: 340,
    languages: ["English", "Mandarin"],
    hospitalAffiliation: "MedBridge Skin & Wellness Pavilion",
    consultationFee: "$195",
    bio: "Dr. Maya Zheng is an esteemed dermatologist with extensive experience in early skin cancer detection, dermoscopic lesion mapping, acne protocols, and biologic therapies for severe psoriasis and eczema.",
    education: [
      "MD, Stanford University School of Medicine",
      "Dermatology Residency, Harvard Combined Dermatology Program",
      "Board Certified, American Board of Dermatology",
    ],
    areasOfExpertise: ["Dermoscopy & Mole Mapping", "Skin Cancer Excision", "Biologic Therapies", "Severe Adult Acne"],
  },
  {
    id: "dr-sarah-jenkins",
    name: "Dr. Sarah Jenkins, MD, FAAP",
    title: "Chief of Pediatric & Adolescent Medicine",
    specialtyId: "pediatrics",
    specialtyName: "Pediatrics",
    image: "/images/doc-peds-dr-sarah.webp",
    qualifications: ["MD - University of Washington School of Medicine", "Residency - Seattle Children's Hospital", "Fellow, American Academy of Pediatrics"],
    experienceYears: 16,
    availability: "Mon, Tue, Wed, Fri (In-Person & Telehealth)",
    rating: 4.99,
    reviewsCount: 420,
    languages: ["English", "Spanish"],
    hospitalAffiliation: "MedBridge Children's Health Center",
    consultationFee: "$160",
    bio: "Dr. Sarah Jenkins has dedicated her career to providing warm, reassuring healthcare for infants, toddlers, school-age kids, and teens. Parents appreciate her attentive listening, gentle examinations, and evidence-based guidance.",
    education: [
      "MD, University of Washington School of Medicine",
      "Pediatrics Residency, Seattle Children's Hospital",
      "Board Certified, American Board of Pediatrics",
    ],
    areasOfExpertise: ["Newborn Care", "Well-Child Milestones", "Pediatric Asthma", "Gentle Immunizations"],
  },
  {
    id: "dr-ananya-patel",
    name: "Dr. Ananya Patel, MD, FACR",
    title: "Chief of Diagnostic Imaging & Radiology",
    specialtyId: "diagnostic-imaging",
    specialtyName: "Diagnostic Imaging",
    image: "/images/doc-imaging-dr-patel.webp",
    qualifications: ["MD - Cornell University", "Fellowship - Massachusetts General Hospital Radiology", "Fellow, American College of Radiology"],
    experienceYears: 18,
    availability: "Mon, Tue, Wed, Thu, Fri (In-Clinic & Reports)",
    rating: 4.94,
    reviewsCount: 195,
    languages: ["English", "Hindi", "Gujarati"],
    hospitalAffiliation: "MedBridge Advanced Imaging Pavilion",
    consultationFee: "$175",
    bio: "Dr. Ananya Patel is a senior radiologist with subspecialty expertise in cross-sectional body MRI, multi-detector CT, and musculoskeletal imaging. She coordinates closely with treating doctors to deliver rapid, definitive diagnostic clarity.",
    education: [
      "MD, Weill Cornell Medical College",
      "Diagnostic Radiology Residency, NewYork-Presbyterian Hospital",
      "Body Imaging & MRI Fellowship, Massachusetts General Hospital / Harvard Medical School",
      "Board Certified, American Board of Radiology",
    ],
    areasOfExpertise: ["High-Field MRI", "Cross-Sectional CT", "Ultrasound Diagnostics", "ALARA Radiation Safety"],
  },
  {
    id: "dr-ananya-sharma",
    name: "Dr. Ananya Sharma, MD, FACP",
    title: "Senior Consultant in Internal Medicine",
    specialtyId: "internal-medicine",
    specialtyName: "Internal Medicine",
    image: "/images/indian-doctors/indian-doctor-01-female-internist.webp",
    qualifications: ["MBBS - AIIMS New Delhi", "MD - Internal Medicine, PGIMER", "Fellow, American College of Physicians"],
    experienceYears: 16,
    availability: "Mon, Wed, Fri (In-Person & Telehealth)",
    rating: 4.96,
    reviewsCount: 215,
    languages: ["English", "Hindi", "Punjabi"],
    hospitalAffiliation: "MedBridge Global Health Pavilion",
    consultationFee: "$175",
    bio: "Dr. Ananya Sharma specializes in preventive adult health, complex metabolic disorders, and chronic disease coordination. With over 16 years of clinical practice, she champions patient-centered lifestyle therapeutics and evidence-led medicine.",
    education: [
      "MBBS, All India Institute of Medical Sciences (AIIMS)",
      "MD in Internal Medicine, PGIMER Chandigarh",
      "Fellowship in Clinical Diagnostics, Johns Hopkins Medicine",
    ],
    areasOfExpertise: ["Metabolic Health", "Preventive Care", "Diabetes Management", "Hypertension"],
  },
  {
    id: "dr-rajesh-verma",
    name: "Dr. Rajesh K. Verma, MD",
    title: "Senior Physician & Clinical Lead",
    specialtyId: "internal-medicine",
    specialtyName: "Internal Medicine",
    image: "/images/indian-doctors/indian-doctor-02-male-physician.webp",
    qualifications: ["MBBS - Maulana Azad Medical College", "MD - Internal Medicine", "Diplomate, National Board (DNB)"],
    experienceYears: 19,
    availability: "Tue, Thu, Sat (In-Person)",
    rating: 4.92,
    reviewsCount: 280,
    languages: ["English", "Hindi"],
    hospitalAffiliation: "MedBridge Global Health Pavilion",
    consultationFee: "$180",
    bio: "Dr. Rajesh K. Verma brings nearly two decades of senior inpatient and outpatient experience, specializing in multi-system diagnostic dilemmas, geriatrics, and cardiovascular risk reduction.",
    education: [
      "MBBS, Maulana Azad Medical College (MAMC)",
      "MD in Internal Medicine, Delhi University",
      "Senior Residency, Safdarjung Hospital",
    ],
    areasOfExpertise: ["Adult Geriatrics", "Multi-System Disorders", "Lipid Management", "Infectious Diseases"],
  },
  {
    id: "dr-vikram-patel",
    name: "Dr. Vikram Patel, MD, DM, FACC",
    title: "Consultant Interventional Cardiologist",
    specialtyId: "cardiology",
    specialtyName: "Cardiology",
    image: "/images/indian-doctors/indian-doctor-04-male-cardiologist.webp",
    qualifications: ["MBBS - Seth GS Medical College", "DM - Cardiology, KEM Hospital", "Fellow, American College of Cardiology"],
    experienceYears: 17,
    availability: "Mon, Tue, Thu (In-Person)",
    rating: 4.97,
    reviewsCount: 310,
    languages: ["English", "Hindi", "Gujarati", "Marathi"],
    hospitalAffiliation: "MedBridge Heart & Vascular Institute",
    consultationFee: "$210",
    bio: "Dr. Vikram Patel is a renowned cardiologist specializing in preventive cardiovascular wellness, non-invasive coronary imaging, and arterial health management.",
    education: [
      "MBBS, Seth GS Medical College & KEM Hospital",
      "MD in General Medicine, Mumbai",
      "DM in Cardiology, KEM Hospital",
      "Fellowship in Preventive Cardiology, Cleveland Clinic",
    ],
    areasOfExpertise: ["Coronary Artery Disease", "Echocardiography", "Preventive Lipids", "Cardiac Imaging"],
  },
  {
    id: "dr-sneha-reddy",
    name: "Dr. Sneha Reddy, MD, FAAP",
    title: "Consultant Pediatrician & Adolescent Health Specialist",
    specialtyId: "pediatrics",
    specialtyName: "Pediatrics",
    image: "/images/indian-doctors/indian-doctor-05-female-pediatrician.webp",
    qualifications: ["MBBS - Osmania Medical College", "MD - Pediatrics, AIIMS", "Fellow, American Academy of Pediatrics"],
    experienceYears: 14,
    availability: "Mon, Wed, Thu, Sat (In-Person & Telehealth)",
    rating: 4.98,
    reviewsCount: 360,
    languages: ["English", "Telugu", "Hindi"],
    hospitalAffiliation: "MedBridge Children's Health Center",
    consultationFee: "$155",
    bio: "Dr. Sneha Reddy provides compassionate, gentle pediatric care from infancy through adolescence. She is passionate about developmental milestone monitoring, gentle childhood immunizations, and empowering parents with clear nutritional guidance.",
    education: [
      "MBBS, Osmania Medical College",
      "MD in Pediatrics, AIIMS New Delhi",
      "Fellowship in Pediatric Pulmonology, Boston Children's Hospital",
    ],
    areasOfExpertise: ["Newborn Milestones", "Pediatric Asthma", "Gentle Immunizations", "Childhood Nutrition"],
  },
  {
    id: "dr-meera-joshi",
    name: "Dr. Meera Joshi, MD, FICR",
    title: "Senior Consultant Radiologist & Diagnostic Specialist",
    specialtyId: "diagnostic-imaging",
    specialtyName: "Diagnostic Imaging",
    image: "/images/indian-doctors/indian-doctor-07-female-radiologist.webp",
    qualifications: ["MBBS - Grant Medical College", "MD - Radio-Diagnosis, Tata Memorial Centre", "Fellow, Indian College of Radiology"],
    experienceYears: 15,
    availability: "Mon, Tue, Wed, Thu, Fri (Reports & Review)",
    rating: 4.95,
    reviewsCount: 230,
    languages: ["English", "Hindi", "Marathi"],
    hospitalAffiliation: "MedBridge Advanced Imaging Pavilion",
    consultationFee: "$170",
    bio: "Dr. Meera Joshi specializes in high-field cross-sectional MRI, digital mammography, and computed tomography. She is recognized for fast, meticulous diagnostic reporting and direct specialist consultations.",
    education: [
      "MBBS, Grant Medical College & Sir JJ Group of Hospitals",
      "MD in Radio-Diagnosis, Tata Memorial Hospital",
      "Fellowship in Musculoskeletal MRI, Massachusetts General Hospital",
    ],
    areasOfExpertise: ["High-Field MRI", "Cross-Sectional CT", "Thoracic Radiology", "Digital X-Ray"],
  },
  {
    id: "dr-arjun-singhania",
    name: "Dr. Arjun Singhania, MS, MCh, Ortho",
    title: "Chief of Joint Replacement & Orthopedic Surgery",
    specialtyId: "orthopedics",
    specialtyName: "Orthopedics",
    image: "/images/indian-doctors/indian-doctor-10-male-surgeon.webp",
    qualifications: ["MBBS - King George's Medical University", "MS - Orthopedic Surgery, AIIMS", "MCh - Orthopedics, UK"],
    experienceYears: 18,
    availability: "Mon, Wed, Fri (In-Person)",
    rating: 4.96,
    reviewsCount: 340,
    languages: ["English", "Hindi"],
    hospitalAffiliation: "MedBridge Orthopedic & Spine Pavilion",
    consultationFee: "$220",
    bio: "Dr. Arjun Singhania is an expert orthopedic surgeon specializing in robotic-assisted joint replacement, sports arthroscopy, and motion-preserving joint therapies.",
    education: [
      "MBBS, King George's Medical University (KGMU)",
      "MS in Orthopedic Surgery, AIIMS New Delhi",
      "MCh Orthopedics, University of Dundee",
      "Fellowship in Joint Reconstruction, Zurich",
    ],
    areasOfExpertise: ["Robotic Knee & Hip Replacement", "Sports Ligament Repair", "Arthroscopic Surgery", "Joint Injections"],
  },
  {
    id: "dr-kavita-pillai",
    name: "Dr. Kavita Pillai, MD, DNB",
    title: "Consultant in Diagnostic Neuroimaging & Body CT",
    specialtyId: "diagnostic-imaging",
    specialtyName: "Diagnostic Imaging",
    image: "/images/indian-doctors/indian-doctor-11-female-diagnostic-specialist.webp",
    qualifications: ["MBBS - Madras Medical College", "MD - Radiodiagnosis, CMC Vellore", "DNB Radiodiagnosis"],
    experienceYears: 13,
    availability: "Mon, Tue, Thu, Fri (Scans & Review)",
    rating: 4.93,
    reviewsCount: 190,
    languages: ["English", "Tamil", "Hindi"],
    hospitalAffiliation: "MedBridge Advanced Imaging Pavilion",
    consultationFee: "$165",
    bio: "Dr. Kavita Pillai brings exceptional accuracy to neurological and musculoskeletal MRI interpretations, ensuring attending clinicians receive rapid, definitive diagnostic clarity.",
    education: [
      "MBBS, Madras Medical College",
      "MD Radiodiagnosis, Christian Medical College (CMC) Vellore",
      "Fellowship in Neuroradiology, UCSF",
    ],
    areasOfExpertise: ["Neuroimaging MRI", "Spine MRI", "Abdominal Multi-Slice CT", "ALARA Safety"],
  },
  {
    id: "dr-suresh-chawla",
    name: "Dr. Suresh Chawla, MD, DM",
    title: "Consultant Neurologist & Stroke Care Specialist",
    specialtyId: "neurology",
    specialtyName: "Neurology",
    image: "/images/indian-doctors/indian-doctor-14-male-neurologist.webp",
    qualifications: ["MBBS - Lady Hardinge Medical College", "MD - Medicine, AIIMS", "DM - Neurology, NIMHANS Bangalore"],
    experienceYears: 16,
    availability: "Tue, Thu, Sat (In-Person & Telehealth)",
    rating: 4.94,
    reviewsCount: 260,
    languages: ["English", "Hindi", "Kannada"],
    hospitalAffiliation: "MedBridge Brain & Spine Institute",
    consultationFee: "$205",
    bio: "Dr. Suresh Chawla trained at the prestigious National Institute of Mental Health and Neurosciences (NIMHANS). He specializes in neurovascular stroke prevention, EMG electrodiagnostics, and refractory headache disorders.",
    education: [
      "MBBS, University College of Medical Sciences",
      "MD Medicine, AIIMS New Delhi",
      "DM Neurology, NIMHANS Bangalore",
    ],
    areasOfExpertise: ["Stroke Prevention", "EMG Diagnostics", "Migraine Therapeutics", "Parkinson's Disease"],
  },
  {
    id: "dr-neha-kapoor",
    name: "Dr. Neha Kapoor, MD",
    title: "Lead Physician in Family & Community Health",
    specialtyId: "family-medicine",
    specialtyName: "Family Medicine",
    image: "/images/indian-doctors/indian-doctor-15-female-family-physician.webp",
    qualifications: ["MBBS - Kasturba Medical College Manipal", "MD - Community & Family Medicine", "Member, Royal College of General Practitioners (MRCGP)"],
    experienceYears: 12,
    availability: "Mon, Tue, Wed, Thu, Fri (In-Person & Telehealth)",
    rating: 4.97,
    reviewsCount: 295,
    languages: ["English", "Hindi", "Punjabi"],
    hospitalAffiliation: "MedBridge Family Health Center",
    consultationFee: "$145",
    bio: "Dr. Neha Kapoor provides holistic, patient-centered family healthcare. Her practice focuses on multi-generational wellness, acute illness triage, and proactive preventive physicals.",
    education: [
      "MBBS, Kasturba Medical College (KMC) Manipal",
      "MD Family Medicine, CMC Vellore",
      "MRCGP International Certification",
    ],
    areasOfExpertise: ["Whole-Family Medicine", "Preventive Physicals", "Adolescent Health", "Women's Wellness"],
  },
  {
    id: "dr-vivek-saxena",
    name: "Dr. Vivek Saxena, MS, Ortho",
    title: "Consultant Orthopedic & Sports Medicine Surgeon",
    specialtyId: "orthopedics",
    specialtyName: "Orthopedics",
    image: "/images/indian-doctors/indian-doctor-16-male-orthopedic.webp",
    qualifications: ["MBBS - Armed Forces Medical College (AFMC)", "MS - Orthopedics, AIIMS", "Fellowship in Sports Arthroscopy"],
    experienceYears: 15,
    availability: "Tue, Thu, Sat (In-Person)",
    rating: 4.91,
    reviewsCount: 220,
    languages: ["English", "Hindi"],
    hospitalAffiliation: "MedBridge Orthopedic & Spine Pavilion",
    consultationFee: "$195",
    bio: "Dr. Vivek Saxena specializes in non-operative tendon recovery, ultrasound-guided regenerative joint injections, and arthroscopic knee and shoulder repair.",
    education: [
      "MBBS, Armed Forces Medical College (AFMC) Pune",
      "MS Orthopedics, AIIMS New Delhi",
      "Sports Medicine Fellowship, Melbourne Orthopaedic Group",
    ],
    areasOfExpertise: ["Knee Arthroscopy", "Rotator Cuff Repair", "PRP Joint Therapy", "Sports Rehabilitation"],
  },
  {
    id: "dr-ritu-agarwal",
    name: "Dr. Ritu Agarwal, MD, DVD",
    title: "Consultant Dermatologist & Dermatosurgeon",
    specialtyId: "dermatology",
    specialtyName: "Dermatology",
    image: "/images/indian-doctors/indian-doctor-17-female-dermatologist.webp",
    qualifications: ["MBBS - Bangalore Medical College", "MD - Dermatology, Venereology & Leprosy", "Fellow, International Society of Dermatology"],
    experienceYears: 14,
    availability: "Mon, Wed, Fri (In-Person)",
    rating: 4.98,
    reviewsCount: 380,
    languages: ["English", "Hindi", "Kannada"],
    hospitalAffiliation: "MedBridge Skin & Wellness Pavilion",
    consultationFee: "$185",
    bio: "Dr. Ritu Agarwal is an accomplished clinical dermatologist specializing in early skin cancer screening via polarized dermoscopy, modern biologic therapies for severe psoriasis, and medical acne recovery programs.",
    education: [
      "MBBS, Bangalore Medical College and Research Institute",
      "MD Dermatology, Post Graduate Institute of Medical Education & Research",
      "Fellowship in Dermatologic Surgery, Singapore",
    ],
    areasOfExpertise: ["Dermoscopy & Mole Mapping", "Biologic Therapies", "Severe Adult Acne", "Barrier Restoration"],
  },
  {
    id: "dr-harish-bhattacharya",
    name: "Dr. Harish Bhattacharya, MD, FRCP",
    title: "Chief of Medicine & Senior Clinical Director",
    specialtyId: "internal-medicine",
    specialtyName: "Internal Medicine",
    image: "/images/indian-doctors/indian-doctor-20-male-chief-of-medicine.webp",
    qualifications: ["MBBS - Medical College Kolkata", "MD - Internal Medicine, AIIMS", "Fellow, Royal College of Physicians (FRCP London)"],
    experienceYears: 22,
    availability: "Mon, Tue, Thu (In-Person & VIP Consultations)",
    rating: 4.99,
    reviewsCount: 450,
    languages: ["English", "Bengali", "Hindi"],
    hospitalAffiliation: "MedBridge Global Health Pavilion",
    consultationFee: "$225",
    bio: "Dr. Harish Bhattacharya brings over two decades of distinguished clinical leadership. He oversees internal medicine departments, coordinating multispecialty panels for complex and unsolved medical diagnoses.",
    education: [
      "MBBS, Medical College Kolkata (Estd. 1835)",
      "MD Internal Medicine, AIIMS New Delhi",
      "Senior Fellow, Royal College of Physicians London",
    ],
    areasOfExpertise: ["Diagnostic Dilemmas", "Cardiometabolic Syndrome", "Clinical Leadership", "Longevity Medicine"],
  },
  {
    id: "dr-sunita-deshmukh",
    name: "Dr. Sunita Deshmukh, MD",
    title: "Senior Family Physician & Preventative Lead",
    specialtyId: "family-medicine",
    specialtyName: "Family Medicine",
    image: "/images/indian-doctors/indian-doctor-09-female-general-physician.webp",
    qualifications: ["MBBS - BJ Medical College Pune", "MD - Family Medicine, AIIMS", "Fellow, Academy of Family Physicians of India"],
    experienceYears: 16,
    availability: "Mon, Wed, Fri (In-Person & Telehealth)",
    rating: 4.95,
    reviewsCount: 275,
    languages: ["English", "Hindi", "Marathi"],
    hospitalAffiliation: "MedBridge Family Health Center",
    consultationFee: "$150",
    bio: "Dr. Sunita Deshmukh provides continuous healthcare for patients of all age groups. Her clinical focus includes preventative wellness, childhood growth reviews, and lifestyle metabolic management.",
    education: [
      "MBBS, B.J. Medical College Pune",
      "MD Family Medicine, AIIMS New Delhi",
      "Diploma in Child Health (DCH), Mumbai",
    ],
    areasOfExpertise: ["Whole-Family Care", "Well-Child Checks", "Preventative Immunization", "Hypertension Care"],
  },
  {
    id: "dr-priya-nair",
    name: "Dr. Priya Nair, MD",
    title: "Consultant in Family & Adolescent Medicine",
    specialtyId: "family-medicine",
    specialtyName: "Family Medicine",
    image: "/images/indian-doctors/indian-doctor-03-female-consultant.webp",
    qualifications: ["MBBS - Government Medical College Trivandrum", "MD - General & Family Practice", "Member, Royal College of Physicians"],
    experienceYears: 13,
    availability: "Tue, Thu, Sat (In-Person)",
    rating: 4.93,
    reviewsCount: 198,
    languages: ["English", "Malayalam", "Hindi"],
    hospitalAffiliation: "MedBridge Family Health Center",
    consultationFee: "$145",
    bio: "Dr. Priya Nair specializes in adolescent health, chronic disease screening, and family preventative medicine, delivering compassionate care with synchronized digital records.",
    education: [
      "MBBS, Government Medical College Thiruvananthapuram",
      "MD Family Practice, Post Graduate Institute of Medical Sciences",
      "Certification in Adolescent Health, Royal College of Paediatrics",
    ],
    areasOfExpertise: ["Adolescent Health", "Preventative Screenings", "Routine Vaccinations", "Family Wellness"],
  },
  {
    id: "dr-manoj-kulkarni",
    name: "Dr. Manoj Kulkarni, MS, MCh",
    title: "Consultant Pediatric & Adolescent Specialist",
    specialtyId: "pediatrics",
    specialtyName: "Pediatrics",
    image: "/images/indian-doctors/indian-doctor-18-male-operating-specialist.webp",
    qualifications: ["MBBS - Seth GS Medical College", "MS - General Surgery", "MCh - Pediatric Health, AIIMS"],
    experienceYears: 17,
    availability: "Mon, Tue, Thu (In-Person)",
    rating: 4.97,
    reviewsCount: 310,
    languages: ["English", "Hindi", "Marathi"],
    hospitalAffiliation: "MedBridge Children's Health Center",
    consultationFee: "$170",
    bio: "Dr. Manoj Kulkarni provides warm, child-friendly consultations and pediatric health evaluations. Parents value his unhurried explanations and gentle clinical approach.",
    education: [
      "MBBS, Seth GS Medical College & KEM Hospital Mumbai",
      "MS General Surgery, Mumbai University",
      "MCh Pediatric Specialties, AIIMS New Delhi",
    ],
    areasOfExpertise: ["Childhood Development", "Pediatric Consultations", "Gentle Care Protocols", "Child Health Clearances"],
  },
  {
    id: "dr-shalini-bose",
    name: "Dr. Shalini Bose, MD, DNB",
    title: "Consultant Dermatologist & Dermatosurgeon",
    specialtyId: "dermatology",
    specialtyName: "Dermatology",
    image: "/images/indian-doctors/indian-doctor-19-female-oncologist.webp",
    qualifications: ["MBBS - Medical College Kolkata", "MD - Dermatology, AIIMS", "DNB Dermatology"],
    experienceYears: 15,
    availability: "Tue, Thu, Sat (In-Person & Telehealth)",
    rating: 4.96,
    reviewsCount: 320,
    languages: ["English", "Bengali", "Hindi"],
    hospitalAffiliation: "MedBridge Skin & Wellness Pavilion",
    consultationFee: "$190",
    bio: "Dr. Shalini Bose has over 15 years of expertise in full-body dermoscopy, skin barrier repair, and procedural dermatology for benign and atypical lesions.",
    education: [
      "MBBS, Medical College Kolkata",
      "MD Dermatology & Venereology, AIIMS New Delhi",
      "Fellowship in Dermatologic Oncology & Dermoscopy, London",
    ],
    areasOfExpertise: ["Dermoscopy & Mole Reviews", "Skin Barrier Protocols", "Biologic Therapies", "Procedural Dermatology"],
  },
];

export function getDoctorsBySpecialty(specialtyId: string): Doctor[] {
  const direct = DOCTORS_DATA.filter((doc) => doc.specialtyId === specialtyId);
  if (direct.length >= 3) return direct;
  // If fewer than 3, supplement with related collaborative doctors for a balanced 3-4 card showcase
  const others = DOCTORS_DATA.filter((doc) => doc.specialtyId !== specialtyId);
  return [...direct, ...others].slice(0, 3);
}

export function getDoctorById(id: string): Doctor | undefined {
  return DOCTORS_DATA.find((doc) => doc.id === id);
}

export function getSpecialtyById(id: string): SpecialtyData | undefined {
  return SPECIALTIES_DATA[id];
}

export function getSpecialtiesList(): SpecialtyData[] {
  return Object.values(SPECIALTIES_DATA);
}
