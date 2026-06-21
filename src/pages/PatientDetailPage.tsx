import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPatientById, type IPatient } from "../services/patientService";
import {
  getPatientVisitHistory,
  getAIPatientSummary,
  type IVisit,
} from "../services/visitService";
import {
  getFilesByPatient,
  uploadMedicalFile,
  deleteMedicalFile,
  type IMedicalFile,
  type FileType,
} from "../services/medicalFileService";
import {
  getAppointmentsByPatient,
  updateAppointmentStatus,
  type IAppointment,
  type AppointmentStatus,
} from "../services/appointmentService";

type Tab = "visits" | "files" | "appointments";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [patient, setPatient] = useState<IPatient | null>(null);
  const [visits, setVisits] = useState<IVisit[]>([]);
  const [files, setFiles] = useState<IMedicalFile[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [tab, setTab] = useState<Tab>("visits");
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Upload panel state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadVisitId, setUploadVisitId] = useState("");
  const [uploadFileType, setUploadFileType] = useState<FileType>("MEDICAL_REPORT");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [patRes, visitRes, fileRes, apptRes] = await Promise.all([
          getPatientById(id),
          getPatientVisitHistory(id),
          getFilesByPatient(id),
          getAppointmentsByPatient(id),
        ]);
        console.log("PATIENT", patRes.data);
        console.log("VISITS", visitRes.data);
        console.log("FILES", fileRes.data);
        console.log("APPOINTMENTS", apptRes.data);
        setPatient(patRes.data);
        setVisits(visitRes.data?.visits || []);

        setFiles(
          Array.isArray(fileRes.data) ? fileRes.data : fileRes.data.data || [],
        );

        setAppointments(
          Array.isArray(apptRes.data) ? apptRes.data : apptRes.data.data || [],
        );
      } catch (err: unknown) {
        const e = err as { message: string };
        console.log("PATIENT DETAIL ERROR:", e.message);
        setError("Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleUploadFile = async () => {
    if (!uploadVisitId || !uploadFile) {
      setUploadError("Please select a visit and a file.");
      return;
    }
    try {
      setUploadLoading(true);
      setUploadError("");
      const res = await uploadMedicalFile({
        visitId: uploadVisitId,
        fileType: uploadFileType,
        file: uploadFile,
      });
      setFiles((prev) => [res.data, ...prev]);
      setShowUpload(false);
      setUploadVisitId("");
      setUploadFile(null);
      setUploadFileType("MEDICAL_REPORT");
    } catch (err: unknown) {
      const e = err as { message: string };
      setUploadError(e.message || "Upload failed.");
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

  const handleAISummary = async () => {
    if (!id) return;
    try {
      setAiLoading(true);
      const res = await getAIPatientSummary(id);
      setAiSummary(res.data.summary);
    } catch (err: unknown) {
      const e = err as { message: string };
      console.log("AI SUMMARY ERROR:", e.message);
      alert("AI summary failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleStatusChange = async (
    apptId: string,
    status: AppointmentStatus,
  ) => {
    try {
      await updateAppointmentStatus(apptId, status);
      setAppointments((prev) =>
        prev.map((a) => (a._id === apptId ? { ...a, status } : a)),
      );
    } catch (err: unknown) {
      const e = err as { message: string };
      console.log("STATUS UPDATE ERROR:", e.message);
      alert("Failed to update appointment status.");
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-400 text-sm">Loading patient...</div>;
  }

  if (error || !patient) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error || "Patient not found."}
        </div>
      </div>
    );
  }

  const age = Math.floor(
      // eslint-disable-next-line react-hooks/purity
    (Date.now() - new Date(patient.dateOfBirth).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25),
  );

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/patients")}
        className="text-sm text-slate-500 hover:text-slate-700 mb-4 block"
      >
        ← Back to Patients
      </button>

      {/* Patient Info Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {patient.nic} · {patient.gender} · {age} years
            </p>
          </div>
          {user?.role === "DOCTOR" && (
            <button
              onClick={() => navigate(`/visits/new?patientId=${patient._id}`)}
              className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + New Visit
            </button>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <InfoItem label="Phone" value={patient.phone} />
          <InfoItem
            label="Date of Birth"
            value={new Date(patient.dateOfBirth).toLocaleDateString()}
          />
          <InfoItem label="Address" value={patient.address} />
        </div>
      </div>

      {/* AI Summary */}
      {user?.role === "DOCTOR" && (
        <div className="mb-5">
          <button
            onClick={handleAISummary}
            disabled={aiLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {aiLoading ? "Generating Summary..." : "✨ AI Patient Summary"}
          </button>
          {aiSummary && (
            <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap max-w-3xl">
              {aiSummary}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-5">
        {(["visits", "files", "appointments"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "border-b-2 border-blue-700 text-blue-700"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}{" "}
            <span className="text-xs text-slate-400 ml-1">
              (
              {t === "visits"
                ? visits.length
                : t === "files"
                  ? files.length
                  : appointments.length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Visits Tab */}
      {tab === "visits" && (
        <div className="space-y-3">
          {visits.length === 0 ? (
            <p className="text-sm text-slate-400">No visits recorded.</p>
          ) : (
            visits.map((v) => (
              <div
                key={v._id}
                className="bg-white border border-slate-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Visit on {new Date(v.visitDate).toLocaleDateString()}
                  </p>
                  {user?.role === "DOCTOR" && (
                    <button
                      onClick={() => navigate(`/visits/${v._id}/edit`)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <InfoItem label="Symptoms" value={v.symptoms} />
                  <InfoItem label="Diagnosis" value={v.diagnosis} />
                  <InfoItem label="Prescription" value={v.prescription} />
                  {v.notes && <InfoItem label="Notes" value={v.notes} />}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Files Tab */}
      {tab === "files" && (
        <div className="space-y-3">
          {/* Upload button — DOCTOR only */}
          {user?.role === "DOCTOR" && (
            <div>
              <button
                onClick={() => {
                  setShowUpload((v) => !v);
                  setUploadError("");
                }}
                className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {showUpload ? "✕ Cancel" : "⬆ Upload File"}
              </button>

              {/* Inline upload panel */}
              {showUpload && (
                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700">Upload Medical File</h3>

                  {/* Visit selector */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Select Visit *</label>
                    <select
                      value={uploadVisitId}
                      onChange={(e) => setUploadVisitId(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">-- Choose a visit --</option>
                      {visits.map((v) => (
                        <option key={v._id} value={v._id}>
                          {new Date(v.visitDate).toLocaleDateString()} — {v.diagnosis}
                        </option>
                      ))}
                    </select>
                    {visits.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">No visits recorded for this patient yet.</p>
                    )}
                  </div>

                  {/* File type selector */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">File Type *</label>
                    <select
                      value={uploadFileType}
                      onChange={(e) => setUploadFileType(e.target.value as FileType)}
                      className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="MEDICAL_REPORT">Medical Report</option>
                      <option value="BLOOD_REPORT">Blood Report</option>
                      <option value="XRAY">X-Ray</option>
                      <option value="SCAN_REPORT">Scan Report</option>
                      <option value="PRESCRIPTION_IMAGE">Prescription Image</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  {/* File input */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Choose File *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.dicom,.dcm"
                      onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                      className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                    />
                  </div>

                  {uploadError && (
                    <p className="text-xs text-red-500">{uploadError}</p>
                  )}

                  <button
                    onClick={handleUploadFile}
                    disabled={uploadLoading}
                    className="bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                  >
                    {uploadLoading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Files list */}
          {files.length === 0 ? (
            <p className="text-sm text-slate-400">No medical files uploaded.</p>
          ) : (
            files.map((f) => (
              <div
                key={f._id}
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">{f.fileName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {f.fileType} · {new Date(f.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={f.cloudinaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </a>
                  {(user?.role === "DOCTOR" || user?.role === "ADMIN") && (
                    <button
                      onClick={() => handleDeleteFile(f._id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Appointments Tab */}
      {tab === "appointments" && (
        <div className="space-y-2">
          {appointments.length === 0 ? (
            <p className="text-sm text-slate-400">No appointments found.</p>
          ) : (
            appointments.map((a) => (
              <div
                key={a._id}
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {new Date(a.appointmentDate).toLocaleString()}
                  </p>
                  {a.notes && (
                    <p className="text-xs text-slate-400 mt-0.5">{a.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={a.status} />
                  <select
                    value={a.status}
                    onChange={(e) =>
                      handleStatusChange(
                        a._id,
                        e.target.value as AppointmentStatus,
                      )
                    }
                    className="text-xs border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
    <p className="text-sm text-slate-700">{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${styles[status] || "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};

export default PatientDetailPage;
