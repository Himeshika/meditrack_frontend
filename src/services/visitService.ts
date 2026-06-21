import api from "./api";
import type { IPatient } from "./patientService";
import type { IUser } from "./authService";

export interface IVisit {
    _id: string;
    patient: IPatient | string;
    doctor: IUser | string;
    symptoms: string;
    diagnosis: string;
    prescription: string;
    notes?: string;
    visitDate: string;
    createdAt: string;
    updatedAt: string;
}

export const createVisit = async (data: {
    patientId: string;
    symptoms: string;
    diagnosis: string;
    prescription: string;
    notes?: string;
}) => {
    const res = await api.post("/visits", data);
    return res.data;
    // res.data shape: { message, data: IVisit }
};

export const getPatientVisitHistory = async (patientId: string) => {
    const res = await api.get(`/visits/patient/${patientId}/history`);
    return res.data;
    // res.data shape: { message, data: { patient, visits: IVisit[], medicalFiles } }
};

export const getVisitById = async (id: string) => {
    const res = await api.get(`/visits/${id}`);
    return res.data;
    // res.data shape: { message, data: IVisit }
};

export const updateVisit = async (
    id: string,
    data: {
        symptoms?: string;
        diagnosis?: string;
        prescription?: string;
        notes?: string;
    }
) => {
    const res = await api.patch(`/visits/${id}`, data);
    return res.data;
};

export const getAIPatientSummary = async (patientId: string) => {
    const res = await api.get(`/visits/patient/${patientId}/ai-summary`);
    return res.data;
    // res.data shape: { message, data: { summary: string } }
};
