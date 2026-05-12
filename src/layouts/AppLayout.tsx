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
    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            {/* Skeleton del Navbar */}
            <header className="bg-blue-600 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Simula el Logo */}
                    <div className="h-8 bg-blue-500/50 rounded w-48"></div>

                    <div className="flex items-center gap-6">
                        {/* Simula la información del usuario (Nombre y Rol) */}
                        <div className="text-right flex flex-col items-end gap-2 mt-2 md:mt-0">
                            <div className="h-4 bg-blue-500/50 rounded w-32"></div>
                            <div className="h-3 bg-blue-500/50 rounded w-20"></div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Simula el botón "Mi Perfil" */}
                            <div className="h-10 bg-gray-200/50 rounded-lg w-28 hidden md:block"></div>
                            {/* Simula el botón "Cerrar Sesión" */}
                            <div className="h-10 bg-blue-700/50 rounded-lg w-32 hidden md:block"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Skeleton del Contenido Principal (Simula el Dashboard) */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="space-y-6">
                    <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-96 mb-8"></div>

                    {/* Malla de tarjetas fantasmas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
    // 3. Si el token expiró o es inválido (isError), lo mandamos al login
    if (isError) {
        localStorage.removeItem('AUTH_TOKEN');
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <header className="
                bg-gradient-to-b from-white to-[#0066ff] to-90%
                sm:bg-gradient-to-r sm:from-white sm:to-[#0066ff] 
                px-3 py-4 md:px-8 shadow-md
                ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="flex items-center">
                            <img
                                src="/LogoFonoAlerta.png"
                                alt="Logo FonoAlerta"
                                className="h-28 w-auto object-contain"
                                style={{ maxWidth: '230px' }}
                            />
                        </Link>
                    </div>

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