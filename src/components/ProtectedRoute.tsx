import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";
interface Props {
    children: ReactNode;
    roles?: string[];
}
const ProtectedRoute = ({ children, roles }: Props) => {
    const { user, token, loading } = useAuth();
    // Still doing the initial auth check (page load with stored token)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-400 text-sm">Loading...</p>
            </div>
        );
    }
    // Token exists but getMe() hasn't finished yet — wait instead of redirecting
    if (token && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-400 text-sm">Loading...</p>
            </div>
        );
    }
    // No token and no user — definitely not logged in
    if (!token && !user) return <Navigate to="/login" replace />;
    // Role check
    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
};
export default ProtectedRoute;