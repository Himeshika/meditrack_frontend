import api from "./api";

export type UserRole = "ADMIN" | "DOCTOR" | "RECEPTIONIST";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
    // res.data shape: { message, data: { user: IUser, accessToken: string } }
};

export const register = async (
    name: string,
    email: string,
    password: string,
    role?: "DOCTOR" | "RECEPTIONIST"
) => {
    const res = await api.post("/auth/register", { name, email, password, ...(role ? { role } : {}) });
    return res.data;
};

export const getMe = async () => {
    const res = await api.get("/auth/me");
    return res.data;
    // res.data shape: { message, data: IUser }
};
