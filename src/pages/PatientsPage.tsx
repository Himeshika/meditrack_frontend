import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    getAllPatients,
    searchPatientByNIC,
    type IPatient,
} from "../services/patientService";

const PatientsPage = () => {
    const [patients, setPatients] = useState<IPatient[]>([]);
    const [nicSearch, setNicSearch] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await getAllPatients();
            setPatients(res.data);
        } catch (err: unknown) {
            const e = err as { message: string; response?: { data?: { message?: string } } };
            console.log("FETCH PATIENTS ERROR:", e.message);
            setError(e.response?.data?.message || "Failed to load patients.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleNICSearch = async () => {
        if (!nicSearch.trim()) {
            fetchPatients();
            return;
        }
        try {
            setLoading(true);
            setError("");
            const res = await searchPatientByNIC(nicSearch.trim().toUpperCase());
            setPatients([res.data]);
        } catch (err: unknown) {
            const e = err as { message: string };
            console.log("NIC SEARCH ERROR:", e.message);
            setError("No patient found with that NIC.");
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Patients</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Search by NIC or browse all registered patients
                    </p>
                </div>
                {(user?.role === "RECEPTIONIST" || user?.role === "ADMIN") && (
                    <button
                        onClick={() => navigate("/patients/register")}
                        className="bg-blue-800 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        + Register Patient
                    </button>
                )}
            </div>

            {/* NIC Search Bar */}
            <div className="flex gap-2 mb-5 max-w-md">
                <input
                    type="text"
                    value={nicSearch}
                    onChange={(e) => setNicSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNICSearch()}
                    placeholder="Search by NIC (e.g. 199012345678)"
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleNICSearch}
                    className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                    Search
                </button>
                {nicSearch && (
                    <button
                        onClick={() => {
                            setNicSearch("");
                            fetchPatients();
                        }}
                        className="text-sm text-slate-500 hover:text-slate-700 px-2"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">NIC</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">Loading...</td>
                            </tr>
                        ) : patients.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">No patients found.</td>
                            </tr>
                        ) : (
                            patients.map((p) => (
                                <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.nic}</td>
                                    <td className="px-4 py-3 font-medium text-slate-800">{p.firstName} {p.lastName}</td>
                                    <td className="px-4 py-3 text-slate-600">{p.gender}</td>
                                    <td className="px-4 py-3 text-slate-600">{p.phone}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => navigate(`/patients/${p._id}`)}
                                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                        >
                                            View →
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

export default PatientsPage;
