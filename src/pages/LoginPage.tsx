import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            setLoading(true);
            const res = await login(email, password);
            setToken(res.data.accessToken);
            navigate("/dashboard");
        } catch (err) {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-[Inter,sans-serif]">
            {/* Left panel — gradient */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700" />
                <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute bottom-1/4 -left-16 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Brand */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-16">
                        <span className="text-3xl">🏥</span>
                        <span className="text-2xl font-bold text-white tracking-tight">MediTrack</span>
                    </div>

                    {/* Illustration area */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {[
                                { label: "Patients", val: "1,248", color: "bg-blue-500/30" },
                                { label: "Appointments", val: "84", color: "bg-cyan-500/30" },
                                { label: "Doctors", val: "32", color: "bg-violet-500/30" },
                                { label: "Reports", val: "567", color: "bg-emerald-500/30" },
                            ].map((c) => (
                                <div key={c.label} className={`${c.color} rounded-xl p-3 border border-white/10`}>
                                    <p className="text-white/60 text-xs mb-0.5">{c.label}</p>
                                    <p className="text-white text-lg font-bold">{c.val}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            {["Patient registered — M. Fernando", "Appointment — Dr. Perera @ 10:00"].map((t, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                    <span className="text-xs text-white/70 truncate">{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-white mb-3">
                        Your healthcare hub,<br />
                        <span className="text-cyan-300">all in one place.</span>
                    </h2>
                    <p className="text-blue-200/75 text-sm leading-relaxed max-w-sm">
                        Securely manage patients, appointments, and medical records with role-based access control and real-time analytics.
                    </p>
                </div>

                {/* Bottom features */}
                <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-2">
                    {["HIPAA Compliant", "Role-Based Access", "Secure & Encrypted"].map((tag) => (
                        <div key={tag} className="flex items-center gap-1.5 text-white/60 text-xs">
                            <span className="text-emerald-400">✓</span> {tag}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <span className="text-2xl">🏥</span>
                        <span className="text-xl font-bold text-blue-900">MediTrack</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
                            <p className="text-sm text-slate-500 mt-1">Sign in to your MediTrack account</p>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
                                <span className="text-base mt-0.5">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                                        placeholder="doctor@hospital.com"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-sm font-medium text-slate-700">Password</label>
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md mt-2"
                                >
                                    {loading ? "Signing in…" : "Sign In"}
                                </button>
                            </div>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>

                    {/* Back to home */}
                    <p className="text-center mt-6">
                        <Link to="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                            ← Back to home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
