"use client";
import React, { useEffect, useState } from "react";
import { savePatientData, getPatientData } from "../utils/storage";
import toast, { Toaster } from "react-hot-toast";

interface FormData {
  name: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
  emergencyContact: string;
  address: string;
  bloodGroup: string;
  symptoms: string;
  admissionDate: string;
  insuranceId: string;
}

interface Patient {
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  emergencyContact: string;
  address: string;
  bloodGroup: string;
  symptoms: string;
  admissionDate: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    emergencyContact: "",
    address: "",
    bloodGroup: "",
    symptoms: "",
    admissionDate: "",
    insuranceId: ""
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getPatientData();
      setPatients((data as Patient[]) || []);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.symptoms) newErrors.symptoms = "Symptoms are required";
    if (!formData.admissionDate) newErrors.admissionDate = "Admission Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    await savePatientData({ ...formData, age: Number(formData.age) });
    toast.success("Patient Registered!");

    const updated = await getPatientData();
    setPatients(updated as Patient[]);
    setFormData({
      name: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
      emergencyContact: "",
      address: "",
      bloodGroup: "",
      symptoms: "",
      admissionDate: "",
      insuranceId: ""
    });
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const closePopup = () => {
    setSelectedPatient(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-10">
      <Toaster />

      <div className="md:w-2/3">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Register Patient</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "name", type: "text", label: "Full Name" },
            { name: "age", type: "number", label: "Age" },
            { name: "email", type: "email", label: "Email" },
            { name: "phone", type: "tel", label: "Phone Number" },
            { name: "emergencyContact", type: "tel", label: "Emergency Contact" },
            { name: "address", type: "text", label: "Address" },
            { name: "symptoms", type: "text", label: "Symptoms" },
            { name: "admissionDate", type: "date", label: "Admission Date" },
            { name: "insuranceId", type: "text", label: "Insurance ID" }
          ].map(({ name, type, label }) => (
            <div key={name} className="relative">
              <input
                type={type}
                name={name}
                placeholder=""
                value={formData[name as keyof FormData]}
                onChange={handleChange}
                className="w-full p-3 mt-5 border rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <label
                htmlFor={name}
                className="absolute top-0  left-1 text-gray-500 transition-all transform -translate-y-1/2"
              >
                {label}
              </label>
              {errors[name as keyof FormData] && (
                <p className="text-sm text-red-500">{errors[name as keyof FormData]}</p>
              )}
            </div>
          ))}

          <div className="relative">
          <label className="absolute  top-0 left-1 text-gray-500 transition-all transform -translate-y-1/2">
          Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 mt-5 border rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
          </div>

          <div className="relative">
          <label className="absolute  top-0 left-1 text-gray-500 transition-all transform -translate-y-1/2">
          Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full mt-5 p-3 border rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
            {errors.bloodGroup && <p className="text-sm text-red-500">{errors.bloodGroup}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            Register
          </button>
        </form>
      </div>

      <div className="">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Registered Patients</h2>
        {patients.length === 0 ? (
          <p>No patients yet.</p>
        ) : (
          <ul className="space-y-2">
            {patients.map((p, idx) => (
              <li
                key={idx}
                className="p-3 border rounded bg-white shadow-sm cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => handlePatientClick(p)}
              >
                <strong>{p.name}</strong> — {p.age} yrs, {p.gender}
                <div className="text-sm text-gray-600">{p.email}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedPatient && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 cursor-pointer right-2 text-gray-500 hover:text-gray-700"
              onClick={closePopup}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Patient Details</h3>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone}</p>
            <p><strong>Emergency Contact:</strong> {selectedPatient.emergencyContact}</p>
            <p><strong>Address:</strong> {selectedPatient.address}</p>
            <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup}</p>
            <p><strong>Symptoms:</strong> {selectedPatient.symptoms}</p>
            <p><strong>Admission Date:</strong> {selectedPatient.admissionDate}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
