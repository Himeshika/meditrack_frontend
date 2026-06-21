import { useState, useEffect } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "../services/userService";
import type { IUser, UserRole } from "../services/authService";

const UsersPage = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (err: unknown) {
            const e = err as { message: string };
            console.log("FETCH USERS ERROR:", e.message);
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, role: UserRole) => {
        try {
            await updateUserRole(userId, role);
            setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
        } catch (err: unknown) {
            const e = err as { message: string };
            console.log("ROLE UPDATE ERROR:", e.message);
            alert("Failed to update role.");
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (err: unknown) {
            const e = err as { message: string };
            console.log("DELETE USER ERROR:", e.message);
            alert("Failed to delete user.");
        }
    };

    const roleBadge: Record<UserRole, string> = {
        ADMIN: "bg-amber-100 text-amber-700",
        DOCTOR: "bg-teal-100 text-teal-700",
        RECEPTIONIST: "bg-purple-100 text-purple-700",
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">User Management</h2>
                <p className="text-sm text-slate-500 mt-0.5">Manage staff accounts and their access roles</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Role</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Change Role</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">Loading...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">No users found.</td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleBadge[u.role]}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value as UserRole)}
                                            className="text-xs border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="ADMIN">Admin</option>
                                            <option value="DOCTOR">Doctor</option>
                                            <option value="RECEPTIONIST">Receptionist</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;
