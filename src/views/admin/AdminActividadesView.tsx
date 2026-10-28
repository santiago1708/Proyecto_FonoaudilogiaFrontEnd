import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { deleteActividadAdmin, getActividadesAdmin, getTestsAdmin, saveActividadAdmin } from '../../api/AdminAPI';
import type { ActividadAdmin, Perfil } from '../../types';
import Cargando from '../../components/Cargando';
import EditorLista from '../../components/EditorLista';

type Borrador = Omit<ActividadAdmin, 'id'> & { id?: number };

const Campo = ({ id, etiqueta, valor, onChange }: { id: string; etiqueta: string; valor?: string | null; onChange: (v: string) => void }) => (
    <div>
        <label htmlFor={id} className="etiqueta">{etiqueta}</label>
        <textarea id={id} rows={2} className="campo mt-2" value={valor ?? ''} onChange={e => onChange(e.target.value)} />
    </div>
);

function FormActividad({ inicial, rangos, onVolver }: { inicial: Borrador; rangos: { clave: string; rango: string }[]; onVolver: () => void }) {
    const queryClient = useQueryClient();
    const [a, setA] = useState<Borrador>(inicial);
    const set = (cambios: Partial<Borrador>) => setA(x => ({ ...x, ...cambios }));
    const { mutate, isPending } = useMutation({
        mutationFn: saveActividadAdmin,
        onError: (e: Error) => toast.error(e.message),
        onSuccess: () => { toast.success('Actividad guardada'); queryClient.invalidateQueries({ queryKey: ['admin', 'actividades'] }); onVolver(); }
    });
    const pro = a.perfil === 'profesional';
    return (
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); mutate({ ...a, pasos: a.pasos.filter(p => p.trim()) }); }}>
            <button type="button" onClick={onVolver} className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Actividades
            </button>
            <h1 className="titulo-pagina">{a.id ? 'Editar actividad' : 'Nueva actividad'}</h1>
            <div className="tarjeta grid gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="rango" className="etiqueta">Rango de edad</label>
                    <select id="rango" className="campo mt-2" value={a.clave} onChange={e => set({ clave: e.target.value })}>
                        {rangos.map(r => <option key={r.clave} value={r.clave}>{r.rango}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="perfil" className="etiqueta">Para</label>
                    <select id="perfil" className="campo mt-2" value={a.perfil} onChange={e => set({ perfil: e.target.value as Perfil })}>
                        <option value="familia">Padres y cuidadores</option>
                        <option value="profesional">Profesionales</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="nombre" className="etiqueta">Nombre de la actividad</label>
                    <input id="nombre" className="campo mt-2" value={a.nombre} onChange={e => set({ nombre: e.target.value })} />
                </div>
                <div className="md:col-span-2"><Campo id="objetivo" etiqueta="Objetivo" valor={a.objetivo} onChange={v => set({ objetivo: v })} /></div>
            </div>
            <div className="tarjeta space-y-4">
                <EditorLista etiqueta={pro ? 'Procedimiento' : '¿Cómo realizarla? (pasos)'} valores={a.pasos} onChange={pasos => set({ pasos })} textoAgregar="Agregar paso" />
                {pro ? (
                    <>
                        <Campo id="aspectos" etiqueta="Aspectos por observar" valor={a.aspectos} onChange={v => set({ aspectos: v })} />
                        <Campo id="ofam" etiqueta="Orientación familiar (opcional)" valor={a.orientacionFamiliar} onChange={v => set({ orientacionFamiliar: v })} />
                        <Campo id="opro" etiqueta="Orientación profesional (opcional)" valor={a.orientacionProfesional} onChange={v => set({ orientacionProfesional: v })} />
                        <Campo id="prec" etiqueta="Precaución (opcional)" valor={a.precaucion} onChange={v => set({ precaucion: v })} />
                    </>
                ) : (
                    <>
                        <Campo id="mat" etiqueta="Materiales" valor={a.materiales} onChange={v => set({ materiales: v })} />
                        <Campo id="rec" etiqueta="Recomendación para el cuidador" valor={a.recomendacion} onChange={v => set({ recomendacion: v })} />
                    </>
                )}
            </div>
            <button type="submit" disabled={isPending} className="boton">{isPending ? 'Guardando…' : 'Guardar actividad'}</button>
        </form>
    );
}

export default function AdminActividadesView() {
    const queryClient = useQueryClient();
    const { data: actividades, isLoading } = useQuery({ queryKey: ['admin', 'actividades'], queryFn: getActividadesAdmin });
    const { data: tests } = useQuery({ queryKey: ['admin', 'tests'], queryFn: getTestsAdmin });
    const [perfil, setPerfil] = useState<Perfil>('familia');
    const [clave, setClave] = useState<string | null>(null);
    const [editando, setEditando] = useState<Borrador | null>(null);

    const { mutate: eliminar } = useMutation({
        mutationFn: deleteActividadAdmin,
        onError: (e: Error) => toast.error(e.message),
        onSuccess: () => { toast.success('Actividad eliminada'); queryClient.invalidateQueries({ queryKey: ['admin', 'actividades'] }); }
    });

    const rangos = (tests ?? []).filter(t => t.clave && t.activo).map(t => ({ clave: t.clave!, rango: t.rango ?? t.name }));
    const seleccion = clave ?? rangos[0]?.clave;

    if (isLoading || !tests) return <Cargando />;
    if (editando) return <FormActividad inicial={editando} rangos={rangos} onVolver={() => setEditando(null)} />;

    const lista = (actividades ?? []).filter(a => a.perfil === perfil && a.clave === seleccion);
    const nueva: Borrador = { clave: seleccion ?? '', perfil, nombre: '', objetivo: '', pasos: [''], orden: lista.length };

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="titulo-pagina">Actividades</h1>
                    <p className="mt-2 max-w-2xl text-tinta-suave">Se muestran al terminar la evaluación según la edad del niño y el tipo de cuenta.</p>
                </div>
                <button onClick={() => setEditando(nueva)} className="boton"><Plus className="h-5 w-5" aria-hidden />Nueva actividad</button>
            </header>

            <div className="flex flex-wrap gap-2">
                {(['familia', 'profesional'] as Perfil[]).map(p => (
                    <button key={p} aria-pressed={p === perfil} onClick={() => setPerfil(p)}
                        className={`rounded-full px-4 py-2 font-bold ${p === perfil ? 'bg-tinta text-white' : 'bg-white hover:bg-brand-50'}`}>
                        {p === 'familia' ? 'Padres y cuidadores' : 'Profesionales'}
                    </button>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
                {rangos.map(r => (
                    <button key={r.clave} aria-pressed={r.clave === seleccion} onClick={() => setClave(r.clave)}
                        className={`rounded-full px-4 py-2 font-bold ${r.clave === seleccion ? 'bg-brand-600 text-white' : 'bg-white hover:bg-brand-50'}`}>
                        {r.rango}
                    </button>
                ))}
            </div>

            {lista.length === 0 && <p className="tarjeta text-tinta-suave">No hay actividades para esta combinación. Usa “Nueva actividad” para crear una.</p>}
            <ul className="space-y-3">
                {lista.map(a => (
                    <li key={a.id} className="tarjeta flex flex-wrap items-center gap-4">
                        <div className="min-w-0 flex-1">
                            <p className="font-extrabold">{a.nombre}</p>
                            <p className="text-sm text-tinta-suave">{a.objetivo}</p>
                        </div>
                        <button onClick={() => setEditando(a)} className="boton-secundario px-4 py-2"><Pencil className="h-4 w-4" aria-hidden />Editar</button>
                        <button
                            onClick={() => { if (window.confirm(`¿Eliminar la actividad "${a.nombre}"? Las evaluaciones ya hechas la conservan.`)) eliminar(a.id); }}
                            className="boton-secundario border-rosa/30 px-4 py-2 text-rosa-fuerte hover:bg-rosa-suave"
                        >
                            <Trash2 className="h-4 w-4" aria-hidden />Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
