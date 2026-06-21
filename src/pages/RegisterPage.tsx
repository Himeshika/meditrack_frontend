import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"DOCTOR" | "RECEPTIONIST">("DOCTOR");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            await register(name.trim(), email.trim(), password, role);
            setSuccess("Account created successfully! Redirecting to login…");
            setTimeout(() => navigate("/login"), 1800);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            setError(e.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-[Inter,sans-serif]">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700" />
                <div className="absolute top-1/3 -right-16 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute bottom-1/4 -left-16 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-12">
                        <span className="text-3xl">🏥</span>
                        <span className="text-2xl font-bold text-white tracking-tight">MediTrack</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                        Join the future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
                            healthcare management
                        </span>
                    </h2>
                    <p className="text-blue-200/75 text-base leading-relaxed max-w-sm">
                        Securely manage patients, appointments, and medical records in one unified platform designed for healthcare teams.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    {[
                        { icon: "🔒", text: "Enterprise-grade security" },
                        { icon: "👥", text: "Role-based access control" },
                        { icon: "📊", text: "Real-time analytics & reports" },
                    ].map((item) => (
                        <div key={item.text} className="flex items-center gap-3 text-white/80">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm font-medium">{item.text}</span>
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
                        <div className="mb-7">
                            <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
                            <p className="text-sm text-slate-500 mt-1">Fill in your details to get started</p>
                        </div>

                        {/* Alerts */}
                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
                                <span className="text-base mt-0.5">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-5">
                                <span className="text-base mt-0.5">✅</span>
                                <span>{success}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                                    placeholder="Dr. John Doe"
                                />
                            </div>

                            {/* Email */}
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

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(["DOCTOR", "RECEPTIONIST"] as const).map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                                                role === r
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700"
                                            }`}
                                        >
                                            {r === "DOCTOR" ? "👨‍⚕️ Doctor" : "🧑‍💼 Receptionist"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                                    placeholder="Min. 6 characters"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors ${
                                        confirmPassword && confirmPassword !== password
                                            ? "border-red-300 bg-red-50"
                                            : "border-slate-200"
                                    }`}
                                    placeholder="Re-enter password"
                                />
                                {confirmPassword && confirmPassword !== password && (
                                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                )}
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md mt-1"
                            >
                                {loading ? "Creating account…" : "Create Account"}
                            </button>
                        </div>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
