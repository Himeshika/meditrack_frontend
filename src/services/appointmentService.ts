import api from "./api";
import type { IPatient } from "./patientService";
import type { IUser } from "./authService";

export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface IAppointment {
    _id: string;
    patient: IPatient | string;
    doctor: IUser | string;
    appointmentDate: string;
    status: AppointmentStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export const createAppointment = async (data: {
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    notes?: string;
}) => {
    const res = await api.post("/appointments", data);
    return res.data;
};

export const getAllAppointments = async () => {
    const res = await api.get("/appointments");
    return res.data;
    // res.data shape: { message, data: IAppointment[] }
};

export const getAppointmentsByPatient = async (patientId: string) => {
    const res = await api.get(`/appointments/patient/${patientId}`);
    return res.data;
    // res.data shape: { message, data: IAppointment[] }
};

export const updateAppointmentStatus = async (
    id: string,
    status: AppointmentStatus
) => {
    const res = await api.patch(`/appointments/${id}/status`, { status });
    return res.data;
};
