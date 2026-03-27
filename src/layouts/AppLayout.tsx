import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/AuthAPI';

export default function AppLayout() {
    const navigate = useNavigate();
    const token = localStorage.getItem('AUTH_TOKEN');

    // Obtenemos los datos del usuario logueado
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: 1, // Solo reintenta 1 vez si falla
        refetchOnWindowFocus: false
    });

    const handleLogout = () => {
        localStorage.removeItem('AUTH_TOKEN');
        navigate('/login');
    };

    // 1. Si no hay token de entrada, lo echamos
    if (!token) return <Navigate to="/login" />;

    // 2. Mientras carga la petición, mostramos una pantalla de carga
    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-500">Cargando perfil...</div>;

    // 3. Si el token expiró o es inválido (isError), lo mandamos al login
    if (isError) {
        localStorage.removeItem('AUTH_TOKEN');
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <header className="bg-blue-600 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <Link to="/dashboard" className="text-2xl font-black text-white">
                        Fonoaudiología App
                    </Link>

                    <div className="flex items-center gap-6">
                        {/* AQUI MOSTRAMOS AL USUARIO */}
                        <div className="text-right">
                            <p className="text-white font-bold text-sm md:text-base">Hola, {user?.name}</p>
                            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">{user?.parentesco}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* ... tus otros botones si tienes ... */}

                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors border border-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                Mi Perfil
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-lg font-bold transition-colors text-sm border border-blue-500"
                            >
                                Cerrar Sesión
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Outlet />
            </main>

            <Toaster position="top-right" richColors />
        </div>
    );
}