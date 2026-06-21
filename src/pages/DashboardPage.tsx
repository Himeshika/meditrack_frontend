import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllPatients } from "../services/patientService";
import { getAllAppointments, type IAppointment } from "../services/appointmentService";
import { getAllUsers } from "../services/userService";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

// ---- helpers ---------------------------------------------------------------

const monthlyGrowth = (items: { createdAt: string }[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts: Record<string, number> = {};
    items.forEach((it) => {
        const d = new Date(it.createdAt);
        const key = months[d.getMonth()];
        counts[key] = (counts[key] ?? 0) + 1;
    });
    return months.slice(0, new Date().getMonth() + 1).map((m) => ({ month: m, patients: counts[m] ?? 0 }));
};

const PIE_COLORS = { SCHEDULED: "#2563EB", COMPLETED: "#22C55E", CANCELLED: "#EF4444" };

const roleColor: Record<string, string> = {
    ADMIN: "bg-amber-100 text-amber-800 border-amber-200",
    DOCTOR: "bg-teal-100 text-teal-800 border-teal-200",
    RECEPTIONIST: "bg-violet-100 text-violet-800 border-violet-200",
};

// ---- stat card -------------------------------------------------------------
const StatCard = ({
    label,
    value,
    icon,
    gradient,
    loading,
}: {
    label: string;
    value: number | string;
    icon: string;
    gradient: string;
    loading: boolean;
}) => (
    <div className={`rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all ${gradient}`}>
        <div className="flex items-center justify-between mb-4">
            <span className="text-white/70 text-sm font-medium">{label}</span>
            <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-4xl font-extrabold">
            {loading ? <span className="text-2xl opacity-60">…</span> : value}
        </div>
    </div>
);

// ---- quick action button ---------------------------------------------------
const ActionBtn = ({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
    >
        <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-xs font-medium text-slate-600">{label}</span>
    </button>
);

// ============================================================================

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [patients, setPatients] = useState<{ createdAt: string }[]>([]);
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [doctorCount, setDoctorCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [pRes, aRes, uRes] = await Promise.all([
                    getAllPatients(),
                    getAllAppointments(),
                    getAllUsers(),
                ]);
                setPatients(pRes.data ?? []);
                setAppointments(aRes.data ?? []);
                const docs = (uRes.data ?? []).filter((u: { role: string }) => u.role === "DOCTOR");
                setDoctorCount(docs.length);
            } catch {
                // silently fail — stats just show 0
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // --- derived data -------------------------------------------------------
    const patientGrowth = monthlyGrowth(patients);

    const apptStatusData = [
        { name: "Scheduled", value: appointments.filter((a) => a.status === "SCHEDULED").length, key: "SCHEDULED" },
        { name: "Completed", value: appointments.filter((a) => a.status === "COMPLETED").length, key: "COMPLETED" },
        { name: "Cancelled", value: appointments.filter((a) => a.status === "CANCELLED").length, key: "CANCELLED" },
    ].filter((d) => d.value > 0);

    const upcoming = [...appointments]
        .filter((a) => a.status === "SCHEDULED" && new Date(a.appointmentDate) >= new Date())
        .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
        .slice(0, 4);

    const recent = [...appointments]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const getName = (p: IAppointment["patient"]) =>
        typeof p === "string" ? p : `${p.firstName} ${p.lastName}`;
    const getDoc = (d: IAppointment["doctor"]) => (typeof d === "string" ? d : d.name);

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
            {/* Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        Welcome back, {user?.name?.split(" ")[0]} 👋
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Here's what's happening in your clinic today.</p>
                </div>
                <span
                    className={`self-start sm:self-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        roleColor[user?.role ?? "RECEPTIONIST"]
                    }`}
                >
                    {user?.role}
                </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Patients" value={patients.length} icon="🧑‍⚕️" gradient="bg-gradient-to-br from-blue-600 to-blue-500" loading={loading} />
                <StatCard label="Appointments" value={appointments.length} icon="📅" gradient="bg-gradient-to-br from-cyan-600 to-cyan-500" loading={loading} />
                <StatCard label="Doctors" value={doctorCount} icon="👨‍⚕️" gradient="bg-gradient-to-br from-violet-600 to-violet-500" loading={loading} />
                <StatCard label="Medical Reports" value="—" icon="📋" gradient="bg-gradient-to-br from-emerald-600 to-emerald-500" loading={loading} />
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Patient growth — takes 2/3 */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Patient Registrations</h3>
                    <p className="text-xs text-slate-400 mb-5">Monthly new patients this year</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={patientGrowth}>
                            <defs>
                                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12 }}
                                labelStyle={{ fontWeight: 600, color: "#1e293b" }}
                            />
                            <Area type="monotone" dataKey="patients" stroke="#2563EB" strokeWidth={2.5} fill="url(#blueGrad)" dot={{ r: 4, fill: "#2563EB", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Appointment status pie — 1/3 */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Appointment Status</h3>
                    <p className="text-xs text-slate-400 mb-4">Distribution by status</p>
                    {apptStatusData.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-300 text-sm">No data yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={apptStatusData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                                    {apptStatusData.map((entry) => (
                                        <Cell key={entry.key} fill={PIE_COLORS[entry.key as keyof typeof PIE_COLORS]} />
                                    ))}
                                </Pie>
                                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: "#64748b" }}>{v}</span>} />
                                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Bottom row: Upcoming + Recent Activity + Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Upcoming appointments */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Upcoming Appointments</h3>
                    {loading ? (
                        <p className="text-xs text-slate-400">Loading…</p>
                    ) : upcoming.length === 0 ? (
                        <p className="text-xs text-slate-400">No upcoming appointments.</p>
                    ) : (
                        <div className="space-y-3">
                            {upcoming.map((a) => (
                                <div key={a._id} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {new Date(a.appointmentDate).getDate()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-800 truncate">{getName(a.patient)}</p>
                                        <p className="text-xs text-slate-500 truncate">Dr. {getDoc(a.doctor)}</p>
                                        <p className="text-xs text-blue-600 mt-0.5">
                                            {new Date(a.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent activity */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Activity</h3>
                    {loading ? (
                        <p className="text-xs text-slate-400">Loading…</p>
                    ) : recent.length === 0 ? (
                        <p className="text-xs text-slate-400">No recent activity.</p>
                    ) : (
                        <div className="space-y-3">
                            {recent.map((a) => (
                                <div key={a._id} className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-slate-700 truncate">
                                            Appointment — {getName(a.patient)}
                                        </p>
                                        <p className="text-xs text-slate-400">{timeAgo(a.createdAt)}</p>
                                    </div>
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                                            a.status === "SCHEDULED"
                                                ? "bg-blue-100 text-blue-700"
                                                : a.status === "COMPLETED"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick actions */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <ActionBtn label="View Patients" icon="👥" onClick={() => navigate("/patients")} />
                        <ActionBtn label="Appointments" icon="📅" onClick={() => navigate("/appointments")} />
                        {(user?.role === "RECEPTIONIST" || user?.role === "ADMIN") && (
                            <ActionBtn label="Register Patient" icon="➕" onClick={() => navigate("/patients/register")} />
                        )}
                        {user?.role === "ADMIN" && (
                            <ActionBtn label="Manage Users" icon="⚙️" onClick={() => navigate("/users")} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
