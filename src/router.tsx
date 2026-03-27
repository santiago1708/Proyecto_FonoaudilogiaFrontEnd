import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
// import AppLayout from './layouts/AppLayout';
// import DashboardView from './views/DashboardView';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/register" element={<RegisterView />} />
                    <Route path="/auth/confirm-account" element={<ConfirmAccountView />} />
                </Route>

                {/* Rutas Privadas */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardView />} index />
                    <Route path="/profile" element={<ProfileView />} />
                    <Route path="/dashboard/add-kid" element={<AddKidView />} />
                    <Route path="/dashboard/kid/:id" element={<KidProfileView />} />
                    <Route path="/dashboard/kid/:id/evaluate" element={<EvaluateKidView />} />
                </Route> 
            </Routes>
        </BrowserRouter>
    );
}