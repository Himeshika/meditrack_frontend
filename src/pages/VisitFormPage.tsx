import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { createVisit, getVisitById, updateVisit, type IVisit } from "../services/visitService";
import {
    uploadMedicalFile,
    getFilesByVisit,
    deleteMedicalFile,
    type IMedicalFile,
    type FileType,
} from "../services/medicalFileService";

const VisitFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const patientId = searchParams.get("patientId") || "";
    const isEdit = !!id;

    const [symptoms, setSymptoms] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [prescription, setPrescription] = useState("");
    const [notes, setNotes] = useState("");
    const [visit, setVisit] = useState<IVisit | null>(null);
    const [files, setFiles] = useState<IMedicalFile[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<FileType>("MEDICAL_REPORT");
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    useEffect(() => {
        if (isEdit && id) {
            const fetchVisit = async () => {
                try {
                    const res = await getVisitById(id);
                    const v: IVisit = res.data;
                    setVisit(v);
                    setSymptoms(v.symptoms);
                    setDiagnosis(v.diagnosis);
                    setPrescription(v.prescription);
                    setNotes(v.notes || "");
                    const fileRes = await getFilesByVisit(id);
                    setFiles(fileRes.data);
                } catch (err: unknown) {
                    const e = err as { message: string };
                    console.log("FETCH VISIT ERROR:", e.message);
                    setError("Failed to load visit.");
                }
            };
            fetchVisit();
        }
    }, [id, isEdit]);

    const handleSubmit = async () => {
        setError("");
        if (!symptoms || !diagnosis || !prescription) {
            setError("Symptoms, diagnosis, and prescription are required.");
            return;
        }
        try {
            setLoading(true);
            if (isEdit && id) {
                await updateVisit(id, { symptoms, diagnosis, prescription, notes });
                alert("Visit updated.");
            } else {
                const res = await createVisit({ patientId, symptoms, diagnosis, prescription, notes });
                setVisit(res.data);
                alert("Visit recorded successfully.");
            }
        } catch (err: unknown) {
            const e = err as { message: string; response?: { data?: { message?: string } } };
            console.log("VISIT SUBMIT ERROR:", e.message);
            setError(e.response?.data?.message || "Failed to save visit.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async () => {
        setUploadError("");
        const currentVisitId = isEdit ? id : visit?._id;

        if (!selectedFile) {
            setUploadError("Please select a file.");
            return;
        }
        if (!currentVisitId) {
            setUploadError("Save the visit first before uploading files.");
            return;
        }
        try {
            setUploadLoading(true);
            const res = await uploadMedicalFile({
                visitId: currentVisitId,
                fileType,
                file: selectedFile,
            });
            setFiles((prev) => [...prev, res.data]);
            setSelectedFile(null);
        } catch (err: unknown) {
            const e = err as { message: string };
            console.log("FILE UPLOAD ERROR:", e.message);
            setUploadError("File upload failed.");
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDeleteFile = async (fileId: string) => {
        if (!confirm("Delete this file?")) return;
        try {
            await deleteMedicalFile(fileId);
            setFiles((prev) => prev.filter((f) => f._id !== fileId));
        } catch (err: unknown) {
            const e = err as { message: string };
            console.log("DELETE FILE ERROR:", e.message);
            alert("Failed to delete file.");
        }
    };

    const backPath = visit
        ? `/patients/${typeof visit.patient === "string" ? visit.patient : visit.patient._id}`
        : patientId
        ? `/patients/${patientId}`
        : "/patients";

    return (
        <div className="p-6">
            <button
                onClick={() => navigate(backPath)}
                className="text-sm text-slate-500 hover:text-slate-700 mb-4 block"
            >
                ← Back to Patient
            </button>

            <h2 className="text-xl font-bold text-slate-800 mb-5">
                {isEdit ? "Edit Visit Record" : "New Visit Record"}
            </h2>

            {/* Visit Form */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl mb-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    <TextareaField label="Symptoms *" value={symptoms} onChange={setSymptoms} placeholder="Describe the patient's symptoms..." />
                    <TextareaField label="Diagnosis *" value={diagnosis} onChange={setDiagnosis} placeholder="Clinical diagnosis..." />
                    <TextareaField label="Prescription *" value={prescription} onChange={setPrescription} placeholder="Medications, dosage, instructions..." />
                    <TextareaField label="Notes (optional)" value={notes} onChange={setNotes} placeholder="Additional observations or follow-up notes..." />
                </div>
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                        {loading ? "Saving..." : isEdit ? "Update Visit" : "Save Visit"}
                    </button>
                    <button
                        onClick={() => navigate(backPath)}
                        className="text-sm text-slate-600 hover:text-slate-800 px-4 py-2.5"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* File Upload Section */}
            {(visit || isEdit) && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl">
                    <h3 className="text-base font-semibold text-slate-700 mb-4">Medical Files</h3>
                    <div className="flex flex-wrap gap-3 items-end mb-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">File Type</label>
                            <select
                                value={fileType}
                                onChange={(e) => setFileType(e.target.value as FileType)}
                                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="MEDICAL_REPORT">Medical Report</option>
                                <option value="BLOOD_REPORT">Blood Report</option>
                                <option value="XRAY">X-Ray</option>
                                <option value="SCAN_REPORT">Scan Report</option>
                                <option value="PRESCRIPTION_IMAGE">Prescription Image</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Select File</label>
                            <input
                                type="file"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                            />
                        </div>
                        <button
                            onClick={handleFileUpload}
                            disabled={uploadLoading}
                            className="bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            {uploadLoading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    {uploadError && <p className="text-red-500 text-xs mb-3">{uploadError}</p>}
                    {files.length === 0 ? (
                        <p className="text-sm text-slate-400">No files uploaded yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {files.map((f) => (
                                <div
                                    key={f._id}
                                    className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{f.fileName}</p>
                                        <p className="text-xs text-slate-400">{f.fileType}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <a
                                            href={f.cloudinaryUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            View
                                        </a>
                                        <button
                                            onClick={() => handleDeleteFile(f._id)}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

interface TextareaFieldProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

const TextareaField = ({ label, value, onChange, placeholder }: TextareaFieldProps) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
    </div>
);

export default VisitFormPage;
