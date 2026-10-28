import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAdministradores, setRolAdmin } from '../../api/AdminAPI';
import { useUsuario } from '../../hooks/useUsuario';
import Cargando from '../../components/Cargando';

export default function AdminAdministradoresView() {
    const queryClient = useQueryClient();
    const { user } = useUsuario();
    const [email, setEmail] = useState('');
    const { data, isLoading } = useQuery({ queryKey: ['admin', 'administradores'], queryFn: getAdministradores });
    const { mutate, isPending } = useMutation({
        mutationFn: setRolAdmin,
        onError: (e: Error) => toast.error(e.message),
        onSuccess: (r) => { toast.success(r?.message); setEmail(''); queryClient.invalidateQueries({ queryKey: ['admin', 'administradores'] }); }
    });
    if (isLoading) return <Cargando />;
    return (
        <div className="space-y-6">
            <header>
                <h1 className="titulo-pagina">Administradores</h1>
                <p className="mt-2 max-w-2xl text-tinta-suave">La persona debe crear su cuenta en FonoAlerta antes de darle permisos de administración.</p>
            </header>
            <form className="tarjeta flex flex-wrap items-end gap-3" onSubmit={e => { e.preventDefault(); mutate({ email, rol: 'admin' }); }}>
                <div className="min-w-[16rem] flex-1">
                    <label htmlFor="correo" className="etiqueta">Correo de la cuenta</label>
                    <input id="correo" type="email" required className="campo mt-2" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button type="submit" disabled={isPending} className="boton">Hacer administrador(a)</button>
            </form>
            <ul className="space-y-3">
                {data?.map(a => (
                    <li key={a.id} className="tarjeta flex flex-wrap items-center gap-4">
                        <div className="min-w-0 flex-1">
                            <p className="font-extrabold">{a.name}</p>
                            <p className="text-sm text-tinta-suave">{a.email}</p>
                        </div>
                        {String(a.id) === String(user?.id)
                            ? <span className="text-sm text-tinta-tenue">Tu cuenta</span>
                            : <button onClick={() => { if (window.confirm(`¿Quitar los permisos de administración a ${a.name}?`)) mutate({ email: a.email, rol: 'usuario' }); }}
                                className="boton-secundario border-rosa/30 text-rosa-fuerte hover:bg-rosa-suave">Quitar permisos</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
