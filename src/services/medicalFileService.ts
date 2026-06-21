import api from "./api";

export type FileType =
    | "MEDICAL_REPORT"
    | "BLOOD_REPORT"
    | "XRAY"
    | "SCAN_REPORT"
    | "PRESCRIPTION_IMAGE"
    | "OTHER";

export interface IMedicalFile {
    _id: string;
    patient: string;
    visit: string;
    fileName: string;
    fileType: FileType;
    cloudinaryUrl: string;
    cloudinaryPublicId: string;
    uploadedBy: string;
    uploadedAt: string;
    createdAt: string;
    updatedAt: string;
}

export const uploadMedicalFile = async (data: {
    visitId: string;
    fileType: FileType;
    file: File;
}) => {
    const formData = new FormData();
    formData.append("visitId", data.visitId);
    formData.append("fileType", data.fileType);
    formData.append("file", data.file);

    const res = await api.post("/medical-files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const getFilesByVisit = async (visitId: string) => {
    const res = await api.get(`/medical-files/visit/${visitId}`);
    return res.data;
    // res.data shape: { message, data: IMedicalFile[] }
};

export const getFilesByPatient = async (patientId: string) => {
    const res = await api.get(`/medical-files/patient/${patientId}`);
    return res.data;
    // res.data shape: { message, data: IMedicalFile[] }
};

export const deleteMedicalFile = async (id: string) => {
    const res = await api.delete(`/medical-files/${id}`);
    return res.data;
};
