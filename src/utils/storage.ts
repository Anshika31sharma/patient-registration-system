import { PGlite } from '@electric-sql/pglite';

let db: PGlite | null = null;

export async function initializeDB() {
  try {
    db = new PGlite('patient-data.db');
    await db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER,
        gender TEXT,
        email TEXT,
        phone TEXT,
        emergencyContact TEXT,
        address TEXT,
        bloodGroup TEXT,
        symptoms TEXT,
        admissionDate TEXT,
        insuranceId TEXT
      );
    `);
    console.log("DB initialized");
  } catch (error) {
    console.error("Failed to initialize DB:", error);
  }
}

export const savePatientData = async (data: { [key: string]: any }) => {
  const existing = JSON.parse(localStorage.getItem("patients") || "[]");
  existing.push(data);
  localStorage.setItem("patients", JSON.stringify(existing));
};

export const getPatientData = async () => {
  return JSON.parse(localStorage.getItem("patients") || "[]");
};
