import { useState } from 'react';
import { Navigate, NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
    House, ClipboardCheck, FileText, Lightbulb, Puzzle, CalendarDays, UserRound, LogOut, Menu, X,
    Settings, ClipboardList, MessageCircle, ShieldCheck
} from 'lucide-react';
import { useUsuario } from '../hooks/useUsuario';
import WhatsAppContacto from '../components/WhatsAppContacto';
import Cargando from '../components/Cargando';

const NAV = [
    { to: '/dashboard', texto: 'Inicio', icono: House, end: true },
    { to: '/evaluacion', texto: 'Evaluación', icono: ClipboardCheck },
    { to: '/resultados', texto: 'Resultados', icono: FileText },
    { to: '/recomendaciones', texto: 'Recomendaciones', icono: Lightbulb },
    { to: '/actividades', texto: 'Actividades', icono: Puzzle },
    { to: '/seguimiento', texto: 'Seguimiento', icono: CalendarDays },
    { to: '/profile', texto: 'Perfil', icono: UserRound }
];

const NAV_ADMIN = [
    { to: '/admin', texto: 'Panel', icono: Settings, end: true },
    { to: '/admin/cuestionarios', texto: 'Cuestionarios', icono: ClipboardList },
    { to: '/admin/recomendaciones', texto: 'Recomendaciones', icono: Lightbulb },
    { to: '/admin/actividades', texto: 'Actividades', icono: Puzzle },
    { to: '/admin/contactos', texto: 'Contactos', icono: MessageCircle },
    { to: '/admin/administradores', texto: 'Administradores', icono: ShieldCheck }
];

export default function AppLayout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = localStorage.getItem('AUTH_TOKEN');
    const { user, isLoading, isError, esAdmin } = useUsuario();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const cerrarSesion = () => {
        localStorage.removeItem('AUTH_TOKEN');
        queryClient.clear();
        navigate('/login');
    };

    if (!token) return <Navigate to="/login" />;
    if (isLoading) return <div className="min-h-screen bg-lavanda"><Cargando texto="Preparando tu espacio…" /></div>;
    if (isError) {
        localStorage.removeItem('AUTH_TOKEN');
        return <Navigate to="/login" />;
    }

    const enlaces = (items: typeof NAV, compacto = false) => items.map(({ to, texto, icono: Icono, end }) => (
        <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMenuAbierto(false)}
            className={({ isActive }) =>
                `flex items-center gap-4 rounded-2xl px-4 font-semibold transition-colors ${compacto ? 'py-2 text-sm' : 'py-3'} ${isActive ? 'bg-brand-100 text-brand-800' : 'text-tinta hover:bg-lavanda'}`}
        >
            <Icono className={`${compacto ? 'h-5 w-5' : 'h-6 w-6'} shrink-0`} strokeWidth={1.8} aria-hidden />
            {texto}
        </NavLink>
    ));

    const menu = (
        <nav aria-label="Menú principal" className="flex h-full flex-col gap-1">
            {enlaces(NAV)}
            {esAdmin && (
                <div className="mt-4 rounded-2xl border border-brand-100 p-2">
                    <p className="px-2 pb-1 text-sm font-bold text-tinta-suave">Administración</p>
                    {enlaces(NAV_ADMIN, true)}
                </div>
            )}
            <div className="mt-4">
                <WhatsAppContacto variante="menu" />
            </div>
            <hr className="my-4 border-brand-100" />
            <button onClick={cerrarSesion} className="flex items-center gap-4 rounded-2xl px-4 py-3 font-semibold text-tinta-suave hover:bg-lavanda">
                <LogOut className="h-5 w-5" aria-hidden />
                Cerrar sesión
            </button>
        </nav>
    );

    return (
        <div className="min-h-screen bg-lavanda">
            {/* Barra superior en celulares */}
            <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 px-4 py-2 shadow-suave backdrop-blur lg:hidden">
                <Link to="/dashboard" aria-label="Ir al inicio">
                    <img src="/logo-fonoalerta.png" alt="FonoAlerta" className="h-12 w-auto" />
                </Link>
                <button
                    onClick={() => setMenuAbierto(true)}
                    className="rounded-full p-2 text-tinta hover:bg-lavanda"
                    aria-label="Abrir menú"
                    aria-expanded={menuAbierto}
                >
                    <Menu className="h-7 w-7" />
                </button>
            </header>

            {/* Menú lateral fijo en computador */}
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col overflow-y-auto border-r border-brand-100 bg-white px-5 py-6 lg:flex">
                <Link to="/dashboard" className="mb-8 block px-2" aria-label="Ir al inicio">
                    <img src="/logo-fonoalerta.png" alt="FonoAlerta" className="mx-auto h-36 w-auto" />
                    <p className="mt-2 text-center font-mano text-lg leading-tight text-tinta-suave">
                        Detectamos señales de alerta para cuidar el desarrollo del lenguaje
                    </p>
                </Link>
                {menu}
            </aside>

            {/* Menú desplegable en celulares y tabletas */}
            {menuAbierto && (
                <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
                    <div className="absolute inset-0 bg-tinta/40" onClick={() => setMenuAbierto(false)} />
                    <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col overflow-y-auto bg-white p-5">
                        <div className="mb-6 flex items-center justify-between">
                            <img src="/logo-fonoalerta.png" alt="FonoAlerta" className="h-14 w-auto" />
                            <button onClick={() => setMenuAbierto(false)} className="rounded-full p-2 hover:bg-lavanda" aria-label="Cerrar menú">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        {menu}
                    </div>
                </div>
            )}

            <div className="lg:pl-72">
                <div className="mx-auto flex max-w-6xl justify-end px-4 pt-6 sm:px-8">
                    <Link to="/profile" className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-suave hover:bg-brand-50">
                        <UserRound className="h-5 w-5 text-brand-600" aria-hidden />
                        <span className="text-sm font-bold">{user?.name}</span>
                        <span className="hidden rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700 sm:inline">{esAdmin ? 'Administrador(a)' : user?.parentesco}</span>
                    </Link>
                </div>
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-8">
                    <Outlet />
                </main>
                <footer className="pb-8 text-center text-sm text-tinta-tenue">
                    FonoAlerta · Juntos por una mejor comunicación
                </footer>
            </div>

            <Toaster position="top-right" richColors />
        </div>
    );
}
