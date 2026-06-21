import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";
import {
    LayoutDashboard,
    Users,
    Calendar,
    LogOut,
    UserPlus,
    Bell,
    ChevronRight,
} from "lucide-react";

interface Props {
    children: ReactNode;
}

const NAV_ITEMS = [
    { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
    { to: "/patients", label: "Patients", Icon: Users, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
    { to: "/appointments", label: "Appointments", Icon: Calendar, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
    { to: "/users", label: "Manage Users", Icon: UserPlus, roles: ["ADMIN"] },
];

const Layout = ({ children }: Props) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path: string) =>
        location.pathname === path || location.pathname.startsWith(path + "/");

    const visibleItems = NAV_ITEMS.filter(
        (item) => !item.roles.length || item.roles.includes(user?.role ?? "")
    );

    const initials = user?.name
        ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
        : "?";

    const pageTitles: Record<string, string> = {
        "/dashboard": "Dashboard",
        "/patients": "Patients",
        "/appointments": "Appointments",
        "/users": "User Management",
        "/patients/register": "Register Patient",
    };
    const pageTitle =
        Object.entries(pageTitles).find(([key]) => location.pathname.startsWith(key))?.[1] ?? "MediTrack";

    return (
        <div className="flex h-screen bg-slate-50 font-[Inter,sans-serif] overflow-hidden">
            {/* ── Sidebar ────────────────────────────────────────────────── */}
            <aside
                className="flex flex-col shrink-0 overflow-hidden"
                style={{ width: "260px" }}
            >
                {/* Top — brand */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-800 bg-blue-950">
                    <span className="text-2xl">🏥</span>
                    <div>
                        <h1 className="text-base font-bold text-white tracking-tight leading-tight">MediTrack</h1>
                        <p className="text-xs text-blue-400 leading-tight">Healthcare Platform</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto bg-blue-950 px-3 pt-4 pb-2 space-y-1">
                    <p className="text-xs text-blue-500 font-semibold uppercase tracking-widest px-3 mb-2">Menu</p>
                    {visibleItems.map(({ to, label, Icon }) => {
                        const active = isActive(to);
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden ${
                                    active
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                                        : "text-blue-300 hover:bg-blue-800/60 hover:text-white"
                                }`}
                            >
                                {/* Active indicator bar */}
                                {active && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full" />
                                )}
                                <Icon size={17} className={active ? "text-white" : "text-blue-400 group-hover:text-white"} />
                                <span className="flex-1">{label}</span>
                                {active && <ChevronRight size={14} className="text-white/60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User profile at bottom */}
                <div className="bg-blue-950 border-t border-blue-800 px-4 py-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-blue-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-blue-800/60 hover:bg-red-600 text-blue-300 hover:text-white text-xs font-medium py-2.5 rounded-xl transition-all"
                    >
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main area ──────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Sticky top header */}
                <header className="shrink-0 bg-white border-b border-slate-100 shadow-sm z-10" style={{ height: "64px" }}>
                    <div className="flex items-center justify-between h-full px-6">
                        {/* Page title */}
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">{pageTitle}</h2>
                            <p className="text-xs text-slate-400">
                                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                            </p>
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-3">
                            {/* Notification bell */}
                            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors">
                                <Bell size={17} />
                            </button>

                            {/* Avatar */}
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                    {initials}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-xs font-semibold text-slate-700 leading-tight">{user?.name}</p>
                                    <p className="text-xs text-slate-400 leading-tight">

                                        {user?.role && (user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase())}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
