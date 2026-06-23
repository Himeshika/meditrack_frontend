import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import PatientRegisterPage from "./pages/PatientRegisterPage";
import VisitFormPage from "./pages/VisitFormPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import UsersPage from "./pages/UsersPage";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster richColors position="top-right" />
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <DashboardPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <PatientsPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients/register"
                        element={
                            <ProtectedRoute roles={["RECEPTIONIST", "ADMIN"]}>
                                <Layout>
                                    <PatientRegisterPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients/:id"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <PatientDetailPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/visits/new"
                        element={
                            <ProtectedRoute roles={["DOCTOR"]}>
                                <Layout>
                                    <VisitFormPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/visits/:id/edit"
                        element={
                            <ProtectedRoute roles={["DOCTOR"]}>
                                <Layout>
                                    <VisitFormPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/appointments"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <AppointmentsPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute roles={["ADMIN"]}>
                                <Layout>
                                    <UsersPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;