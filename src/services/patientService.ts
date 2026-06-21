import api from "./api";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface IPatient {
    _id: string;
    nic: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

export const getAllPatients = async () => {
    const res = await api.get("/patients");
    return res.data;
    // res.data shape: { message, data: IPatient[] }
};

export const searchPatientByNIC = async (nic: string) => {
    const res = await api.get(`/patients/search/${nic}`);
    return res.data;
    // res.data shape: { message, data: IPatient }
};

export const getPatientById = async (id: string) => {
    const res = await api.get(`/patients/${id}`);
    return res.data;
    // res.data shape: { message, data: IPatient }
};

export const registerPatient = async (data: {
    nic: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    phone: string;
    address: string;
}) => {
    const res = await api.post("/patients/register", data);
    return res.data;
};

export const updatePatient = async (
    id: string,
    data: Partial<Omit<IPatient, "_id" | "createdAt" | "updatedAt">>
) => {
    const res = await api.patch(`/patients/${id}`, data);
    return res.data;
};
