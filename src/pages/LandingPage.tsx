import { useNavigate } from "react-router-dom";

const features = [
    {
        icon: "👥",
        title: "Patient Management",
        description: "Register, search, and manage patient records with a complete medical history in one place.",
        color: "from-blue-500 to-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: "📅",
        title: "Appointment Scheduling",
        description: "Schedule and manage patient appointments with doctors efficiently and track status.",
        color: "from-cyan-500 to-cyan-600",
        bg: "bg-cyan-50",
    },
    {
        icon: "📁",
        title: "Medical Report Storage",
        description: "Securely store and retrieve medical files, lab reports, and prescription documents.",
        color: "from-violet-500 to-violet-600",
        bg: "bg-violet-50",
    },
    {
        icon: "🤖",
        title: "AI Patient Summaries",
        description: "Get instant AI-generated patient summaries from visit history for faster diagnosis.",
        color: "from-emerald-500 to-emerald-600",
        bg: "bg-emerald-50",
    },
];

const stats = [
    { label: "Patients Managed", value: "10,000+", icon: "🧑‍⚕️" },
    { label: "Doctors", value: "500+", icon: "👨‍⚕️" },
    { label: "Medical Records", value: "50,000+", icon: "📋" },
    { label: "Appointments", value: "25,000+", icon: "📆" },
];

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-[Inter,sans-serif]">
            {/* Nav */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="text-2xl">🏥</span>
                        <span className="text-xl font-bold text-blue-900 tracking-tight">MediTrack</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm font-medium text-slate-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-800" />

                {/* Decorative blobs */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: "48px 48px",
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left content */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs text-white/80 font-medium">Healthcare Platform</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                            Smart Patient <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                                Medical Record
                            </span>{" "}
                            Management
                        </h1>
                        <p className="text-lg text-blue-100/80 leading-relaxed mb-10 max-w-lg">
                            MediTrack streamlines patient records, appointments, and medical reports into a single
                            unified platform—empowering healthcare professionals to deliver better care.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate("/register")}
                                className="inline-flex items-center gap-2 bg-white text-blue-900 font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                            >
                                Get Started Free
                                <span className="text-base">→</span>
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all text-sm backdrop-blur-sm"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-12 flex items-center gap-6">
                            {["HIPAA Compliant", "Role-Based Access", "Secure & Encrypted"].map((tag) => (
                                <div key={tag} className="flex items-center gap-1.5 text-white/60 text-xs">
                                    <span className="text-emerald-400">✓</span> {tag}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — dashboard preview card */}
                    <div className="hidden lg:block">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                                <span className="ml-auto text-xs text-white/50">MediTrack Dashboard</span>
                            </div>
                            {/* Mini stat cards */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {[
                                    { label: "Total Patients", val: "1,248", color: "bg-blue-500/20 border-blue-500/30" },
                                    { label: "Appointments", val: "84", color: "bg-cyan-500/20 border-cyan-500/30" },
                                    { label: "Doctors", val: "32", color: "bg-violet-500/20 border-violet-500/30" },
                                    { label: "Reports", val: "567", color: "bg-emerald-500/20 border-emerald-500/30" },
                                ].map((c) => (
                                    <div key={c.label} className={`border rounded-xl p-3 ${c.color}`}>
                                        <p className="text-white/60 text-xs mb-1">{c.label}</p>
                                        <p className="text-white text-xl font-bold">{c.val}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Mini list */}
                            <div className="space-y-2">
                                {["Patient registered — John Silva", "Appointment scheduled — Dr. Perera", "Report uploaded — Blood Test"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                        <span className="text-xs text-white/70 truncate">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Features</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Everything you need in one platform</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Designed for modern healthcare teams — from receptionists to doctors and administrators.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center text-2xl mb-5`}>
                                    {f.icon}
                                </div>
                                <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-gradient-to-r from-blue-900 to-cyan-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-3">Trusted by healthcare professionals</h2>
                        <p className="text-blue-200/70">Powering clinics, hospitals, and private practices</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((s) => (
                            <div
                                key={s.label}
                                className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-all"
                            >
                                <div className="text-3xl mb-3">{s.icon}</div>
                                <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
                                <div className="text-sm text-blue-200/70">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Ready to modernize your clinic?</h2>
                    <p className="text-slate-500 mb-8">
                        Join healthcare teams already using MediTrack to deliver better patient care.
                    </p>
                    <button
                        onClick={() => navigate("/register")}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        Create your account →
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🏥</span>
                            <span className="text-white font-bold text-lg">MediTrack</span>
                        </div>
                        <p className="text-sm text-center">
                            © {new Date().getFullYear()} MediTrack. All rights reserved. · Smart Patient Record Management System
                        </p>
                        <div className="text-sm text-center">
                            <span>📧 </span>
                            <a href="mailto:support@meditrack.health" className="hover:text-white transition-colors">
                                support@meditrack.health
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
