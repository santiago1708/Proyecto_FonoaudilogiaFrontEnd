import { Navigate, Outlet } from 'react-router-dom';
import { useUsuario } from '../hooks/useUsuario';
import Cargando from './Cargando';

// Solo los administradores pueden entrar a las páginas de gestión
export default function RutaAdmin() {
    const { esAdmin, isLoading } = useUsuario();
    if (isLoading) return <Cargando />;
    return esAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
