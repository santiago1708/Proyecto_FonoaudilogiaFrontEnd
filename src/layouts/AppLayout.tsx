import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';

export default function AppLayout() {
    const navigate = useNavigate();
    
    // Verificamos si hay un token en el navegador
    const token = localStorage.getItem('AUTH_TOKEN');

    const handleLogout = () => {
        localStorage.removeItem('AUTH_TOKEN'); // Borramos el token
        navigate('/login'); // Lo enviamos al login
    };

    // Si no hay token, lo echamos al login automáticamente
    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <header className="bg-blue-600 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/dashboard" className="text-2xl font-black text-white">
                        Fonoaudiología App
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleLogout}
                            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido principal (Aquí se inyectarán el Dashboard, Perfil de Niños, etc.) */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Outlet />
            </main>

            <Toaster position="top-right" richColors />
        </div>
    );
}