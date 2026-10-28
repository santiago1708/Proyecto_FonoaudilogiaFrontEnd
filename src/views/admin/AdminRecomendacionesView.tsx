import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRecomendacionesAdmin, updateRecomendacionAdmin } from '../../api/AdminAPI';
import type { Perfil, RecomendacionNivelAdmin } from '../../types';
import Cargando from '../../components/Cargando';
import NivelBadge from '../../components/NivelBadge';
import EditorLista from '../../components/EditorLista';

const NOMBRES = { esperado: 'Desarrollo esperado', leve: 'Riesgo leve', alto: 'Riesgo alto' } as const;

function TarjetaNivel({ inicial }: { inicial: RecomendacionNivelAdmin }) {
    const queryClient = useQueryClient();
    const [fila, setFila] = useState(inicial);
    const cambiado = JSON.stringify(fila) !== JSON.stringify(inicial);
    const { mutate, isPending } = useMutation({
        mutationFn: updateRecomendacionAdmin,
        onError: (e: Error) => toast.error(e.message),
        onSuccess: () => { toast.success('Recomendaciones guardadas'); queryClient.invalidateQueries({ queryKey: ['admin', 'recomendaciones'] }); }
    });
    return (
        <form className="tarjeta space-y-4" onSubmit={e => { e.preventDefault(); mutate(fila); }}>
            <NivelBadge nivel={fila.nivel} texto={NOMBRES[fila.nivel]} />
            <div>
                <label htmlFor={`obj${fila.id}`} className="etiqueta">{fila.perfil === 'profesional' ? 'Texto introductorio' : 'Objetivo'}</label>
                <textarea id={`obj${fila.id}`} rows={3} className="campo mt-2" value={fila.objetivo ?? ''} onChange={e => setFila({ ...fila, objetivo: e.target.value })} />
            </div>
            <EditorLista etiqueta="Recomendaciones" valores={fila.items} onChange={items => setFila({ ...fila, items })} textoAgregar="Agregar recomendación" />
            <button type="submit" disabled={!cambiado || isPending} className="boton">{isPending ? 'Guardando…' : 'Guardar'}</button>
        </form>
    );
}

export default function AdminRecomendacionesView() {
    const { data, isLoading } = useQuery({ queryKey: ['admin', 'recomendaciones'], queryFn: getRecomendacionesAdmin });
    const [perfil, setPerfil] = useState<Perfil>('familia');
    if (isLoading) return <Cargando />;
    const filas = (data ?? []).filter(f => f.perfil === perfil);
    return (
        <div className="space-y-6">
            <header>
                <h1 className="titulo-pagina">Recomendaciones</h1>
                <p className="mt-2 max-w-2xl text-tinta-suave">Se muestran al terminar cada evaluación según el resultado. Las recomendaciones según cada respuesta se editan en los cuestionarios.</p>
            </header>
            <div role="tablist" className="flex gap-2">
                {(['familia', 'profesional'] as Perfil[]).map(p => (
                    <button key={p} role="tab" aria-selected={p === perfil} onClick={() => setPerfil(p)}
                        className={`rounded-full px-4 py-2 font-bold ${p === perfil ? 'bg-brand-600 text-white' : 'bg-white hover:bg-brand-50'}`}>
                        {p === 'familia' ? 'Padres y cuidadores' : 'Profesionales'}
                    </button>
                ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
                {filas.map(f => <TarjetaNivel key={f.id + f.perfil} inicial={f} />)}
            </div>
        </div>
    );
}
