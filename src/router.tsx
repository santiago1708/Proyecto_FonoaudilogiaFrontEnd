import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import ConfirmAccountView from './views/ConfirmAccountView';
import AppLayout from './layouts/AppLayout';
import DashboardView from './views/DashboardView';
import AddKidView from './views/AddKidView';
import KidProfileView from './views/KidProfileView';
import EvaluateKidView from './views/EvaluateKidView';
import ProfileView from './views/ProfileView';
import EditKidView from './views/EditKidView';
import ForgotPasswordView from './views/ForgotPasswordView';
import ResetPasswordView from './views/ResetPasswordView';
// import AppLayout from './layouts/AppLayout';
// import DashboardView from './views/DashboardView';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                {/* Rutas Públicas */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/register" element={<RegisterView />} />
                    <Route path="/api/auth/confirm-email" element={<ConfirmAccountView />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
                    <Route path="/auth/reset-password" element={<ResetPasswordView />} />
                </Route>

                {/* Rutas Privadas */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardView />} index />
                    <Route path="/profile" element={<ProfileView />} />
                    <Route path="/dashboard/add-kid" element={<AddKidView />} />
                    <Route path="/dashboard/kid/:id" element={<KidProfileView />} />
                    <Route path="/dashboard/kid/:id/evaluate" element={<EvaluateKidView />} />
                    <Route path="/dashboard/kid/:id/edit" element={<EditKidView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}