import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import ConfirmAccountView from './views/ConfirmAccountView';
import ForgotPasswordView from './views/ForgotPasswordView';
import ResetPasswordView from './views/ResetPasswordView';
import PoliticaPrivacidadView from './views/PoliticaPrivacidadView';
import DashboardView from './views/DashboardView';
import EvaluacionView from './views/EvaluacionView';
import ResultadosView from './views/ResultadosView';
import RecomendacionesView from './views/RecomendacionesView';
import ActividadesView from './views/ActividadesView';
import SeguimientoView from './views/SeguimientoView';
import ProfileView from './views/ProfileView';
import AddKidView from './views/AddKidView';
import KidProfileView from './views/KidProfileView';
import EvaluateKidView from './views/EvaluateKidView';
import EditKidView from './views/EditKidView';
import ResultadoEvaluacionView from './views/ResultadoEvaluacionView';
import RutaAdmin from './components/RutaAdmin';
import AdminInicioView from './views/admin/AdminInicioView';
import AdminCuestionariosView from './views/admin/AdminCuestionariosView';
import AdminRecomendacionesView from './views/admin/AdminRecomendacionesView';
import AdminActividadesView from './views/admin/AdminActividadesView';
import AdminContactosView from './views/admin/AdminContactosView';
import AdminAdministradoresView from './views/admin/AdminAdministradoresView';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Rutas públicas */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/register" element={<RegisterView />} />
                    <Route path="/api/auth/confirm-email" element={<ConfirmAccountView />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
                    <Route path="/auth/reset-password" element={<ResetPasswordView />} />
                    <Route path="/politica-privacidad" element={<PoliticaPrivacidadView />} />
                </Route>

                {/* Rutas privadas */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardView />} />
                    <Route path="/evaluacion" element={<EvaluacionView />} />
                    <Route path="/resultados" element={<ResultadosView />} />
                    <Route path="/recomendaciones" element={<RecomendacionesView />} />
                    <Route path="/actividades" element={<ActividadesView />} />
                    <Route path="/seguimiento" element={<SeguimientoView />} />
                    <Route path="/profile" element={<ProfileView />} />
                    <Route path="/dashboard/add-kid" element={<AddKidView />} />
                    <Route path="/dashboard/kid/:id" element={<KidProfileView />} />
                    <Route path="/dashboard/kid/:id/evaluate" element={<EvaluateKidView />} />
                    <Route path="/dashboard/kid/:id/edit" element={<EditKidView />} />
                    <Route path="/dashboard/kid/:id/evaluacion/:evaluacionId" element={<ResultadoEvaluacionView />} />

                    {/* Administración */}
                    <Route element={<RutaAdmin />}>
                        <Route path="/admin" element={<AdminInicioView />} />
                        <Route path="/admin/cuestionarios" element={<AdminCuestionariosView />} />
                        <Route path="/admin/recomendaciones" element={<AdminRecomendacionesView />} />
                        <Route path="/admin/actividades" element={<AdminActividadesView />} />
                        <Route path="/admin/contactos" element={<AdminContactosView />} />
                        <Route path="/admin/administradores" element={<AdminAdministradoresView />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
