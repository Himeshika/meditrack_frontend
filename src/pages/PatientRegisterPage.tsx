import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient, type Gender } from "../services/patientService";

const PatientRegisterPage = () => {
    const [nic, setNic] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState<Gender>("MALE");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError("");

        if (!nic || !firstName || !lastName || !dateOfBirth || !phone || !address) {
            setError("All fields are required.");
            return;
        }

        try {
            setLoading(true);
            const res = await registerPatient({
                nic: nic.toUpperCase(),
                firstName,
                lastName,
                dateOfBirth,
                gender,
                phone,
                address,
            });
            navigate(`/patients/${res.data._id}`);
        } catch (err: unknown) {
            const e = err as { message: string; response?: { data?: { message?: string } } };
            console.log("REGISTER PATIENT ERROR:", e.message);
            setError(e.response?.data?.message || "Failed to register patient.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <button
                    onClick={() => navigate("/patients")}
                    className="text-sm text-slate-500 hover:text-slate-700 mb-3 block"
                >
                    ← Back to Patients
                </button>
                <h2 className="text-xl font-bold text-slate-800">Register New Patient</h2>
                <p className="text-sm text-slate-500 mt-0.5">Fill in the patient's personal details.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="NIC *" value={nic} onChange={setNic} placeholder="199012345678" />
                    <FormField label="First Name *" value={firstName} onChange={setFirstName} placeholder="Kamal" />
                    <FormField label="Last Name *" value={lastName} onChange={setLastName} placeholder="Perera" />
                    <FormField label="Date of Birth *" value={dateOfBirth} onChange={setDateOfBirth} type="date" />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value as Gender)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <FormField label="Phone *" value={phone} onChange={setPhone} placeholder="0771234567" />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        placeholder="No. 12, Main Street, Colombo 07"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                        {loading ? "Registering..." : "Register Patient"}
                    </button>
                    <button
                        onClick={() => navigate("/patients")}
                        className="text-sm text-slate-600 hover:text-slate-800 px-4 py-2.5"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

interface FormFieldProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    type?: string;
}

const FormField = ({ label, value, onChange, placeholder, type = "text" }: FormFieldProps) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export default PatientRegisterPage;
