import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/AuthAPI';
import type { User } from '../types';

// Usuario autenticado (compartido en caché con AppLayout)
export function useUsuario() {
    const query = useQuery<User>({
        queryKey: ['user'],
        queryFn: getUser,
        retry: 1,
        refetchOnWindowFocus: false
    });
    const esProfesional = query.data?.parentesco === 'Profesional';
    const esAdmin = query.data?.rol === 'admin';
    return { ...query, user: query.data, esProfesional, esAdmin };
}
