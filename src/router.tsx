import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import LoginView from './views/LoginView';
// import AppLayout from './layouts/AppLayout';
// import DashboardView from './views/DashboardView';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginView />} />
                    {/* <Route path="/register" element={<RegisterView />} /> */}
                </Route>

                {/* Rutas Privadas */}
                {/* <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardView />} index />
                </Route> 
                */}
            </Routes>
        </BrowserRouter>
    );
}