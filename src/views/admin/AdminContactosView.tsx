import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { deleteContactoAdmin, getContactosAdmin, saveContactoAdmin } from '../../api/AdminAPI';
import type { Contacto } from '../../types';
import Cargando from '../../components/Cargando';

type Borrador = Omit<Contacto, 'id'> & { id?: number };

function FormContacto({ inicial, onListo }: { inicial: Borrador; onListo?: () => void }) {
    const queryClient = useQueryClient();
    const [c, setC] = useState<Borrador>(inicial);
    const refrescar = () => { queryClient.invalidateQueries({ queryKey: ['admin', 'contactos'] }); queryClient.invalidateQueries({ queryKey: ['contactos'] }); };
    const guardar = useMutation({
        mutationFn: saveContactoAdmin,
        onError: (e: Error) => toast.error(e.message),
        onSuccess: () => { toast.success('Contacto guardado'); refrescar(); onListo?.(); }
    });
    const borrar = useMutation({
        mutationFn: deleteContactoAdmin,
        onError: (e: Error) => toast.error(e.message),
        onSuccess: () => { toast.success('Contacto eliminado'); refrescar(); }
    });
    const pre = c.id ?? 'nuevo';
    return (
        <form className="tarjeta grid gap-4 md:grid-cols-2" onSubmit={e => { e.preventDefault(); guardar.mutate(c); }}>
            <div>
                <label htmlFor={`n${pre}`} className="etiqueta">Nombre</label>
                <input id={`n${pre}`} className="campo mt-2" placeholder="Ej.: Fga. María Camila Guzmán" value={c.nombre} onChange={e => setC({ ...c, nombre: e.target.value })} />
            </div>
            <div>
                <label htmlFor={`t${pre}`} className="etiqueta">WhatsApp (con indicativo, ej. 573001234567)</label>
                <input id={`t${pre}`} inputMode="tel" className="campo mt-2" value={c.telefono} onChange={e => setC({ ...c, telefono: e.target.value })} />
            </div>
            <div className="md:col-span-2">
                <label htmlFor={`d${pre}`} className="etiqueta">Descripción corta (opcional)</label>
                <input id={`d${pre}`} className="campo mt-2" placeholder="Ej.: Atiende lunes a viernes, 8 a. m. a 5 p. m." value={c.descripcion ?? ''} onChange={e => setC({ ...c, descripcion: e.target.value })} />
            </div>
            <label className="flex items-center gap-3">
                <input type="checkbox" className="h-5 w-5 accent-brand-600" checked={c.activo !== false} onChange={e => setC({ ...c, activo: e.target.checked })} />
                Visible para los usuarios
            </label>
            <div className="flex flex-wrap justify-end gap-3">
                {c.id && (
                    <button type="button" onClick={() => { if (window.confirm(`¿Eliminar a ${c.nombre} de los contactos?`)) borrar.mutate(c.id!); }}
                        className="boton-secundario border-rosa/30 text-rosa-fuerte hover:bg-rosa-suave">
                        <Trash2 className="h-4 w-4" aria-hidden />Eliminar
                    </button>
                )}
                <button type="submit" disabled={guardar.isPending} className="boton">{c.id ? 'Guardar' : 'Agregar contacto'}</button>
            </div>
        </form>
    );
}

export default function AdminContactosView() {
    const { data, isLoading } = useQuery({ queryKey: ['admin', 'contactos'], queryFn: getContactosAdmin });
    const [agregando, setAgregando] = useState(false);
    if (isLoading) return <Cargando />;
    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="titulo-pagina">Contactos de WhatsApp</h1>
                    <p className="mt-2 max-w-2xl text-tinta-suave">Al tocar “Contactar por WhatsApp”, el usuario elige con quién hablar entre los contactos visibles.</p>
                </div>
                {!agregando && <button onClick={() => setAgregando(true)} className="boton"><Plus className="h-5 w-5" aria-hidden />Agregar contacto</button>}
            </header>
            {agregando && <FormContacto inicial={{ nombre: '', telefono: '', descripcion: '', activo: true }} onListo={() => setAgregando(false)} />}
            {data?.length === 0 && !agregando && <p className="tarjeta text-tinta-suave">Aún no hay contactos. Mientras tanto, el botón de WhatsApp aparece deshabilitado.</p>}
            {data?.map(c => <FormContacto key={`${c.id}-${c.telefono}-${c.nombre}-${c.activo}`} inicial={c} />)}
        </div>
    );
}
