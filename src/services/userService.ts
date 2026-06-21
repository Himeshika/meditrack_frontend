import api from "./api";
import type { UserRole } from "./authService";

export const getAllUsers = async () => {
    const res = await api.get("/users");
    return res.data;
    // res.data shape: { message, data: IUser[] }
};

export const getUserById = async (id: string) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
};

export const updateUserRole = async (id: string, role: UserRole) => {
    const res = await api.patch(`/users/${id}/role`, { role });
    return res.data;
};

export const deleteUser = async (id: string) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
};
