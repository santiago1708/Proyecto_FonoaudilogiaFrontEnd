import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { getTestsAdmin, updateTestAdmin } from '../../api/AdminAPI';
import type { PreguntaAdmin, TestAdmin } from '../../types';
import Cargando from '../../components/Cargando';

function EditorCuestionario({ inicial, onVolver }: { inicial: TestAdmin; onVolver: () => void }) {
    const queryClient = useQueryClient();
    const [test, setTest] = useState<TestAdmin>(() => structuredClone(inicial));

    const { mutate, isPending } = useMutation({
        mutationFn: updateTestAdmin,
        onError: (e: Error) => toast.error(e.message),
        onSuccess: () => {
            toast.success('Cuestionario guardado');
            queryClient.invalidateQueries({ queryKey: ['admin', 'tests'] });
            onVolver();
        }
    });

    const cambiarPregunta = (i: number, cambios: Partial<PreguntaAdmin>) =>
        setTest(t => ({ ...t, preguntas: t.preguntas.map((p, j) => j === i ? { ...p, ...cambios } : p) }));
    const cambiarOpcion = (i: number, k: number, campo: 'respuesta' | 'puntaje', valor: string) =>
        cambiarPregunta(i, {
            opciones: test.preguntas[i].opciones.map((o, j) => j === k ? { ...o, [campo]: campo === 'puntaje' ? Number(valor) : valor } : o)
        });

    const maximo = test.preguntas.reduce((t, p) => t + Math.max(0, ...p.opciones.map(o => Number(o.puntaje) || 0)), 0);

    return (
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); mutate(test); }}>
            <button type="button" onClick={onVolver} className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Cuestionarios
            </button>

            <header className="tarjeta grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label htmlFor="nombre" className="etiqueta">Nombre</label>
                    <input id="nombre" className="campo mt-2" value={test.name} onChange={e => setTest({ ...test, name: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="rango" className="etiqueta">Rango que ve el usuario</label>
                    <input id="rango" className="campo mt-2" value={test.rango ?? ''} onChange={e => setTest({ ...test, rango: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="min" className="etiqueta">Desde (meses)</label>
                        <input id="min" type="number" min={0} className="campo mt-2" value={test.minMeses} onChange={e => setTest({ ...test, minMeses: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label htmlFor="max" className="etiqueta">Hasta (meses)</label>
                        <input id="max" type="number" min={0} className="campo mt-2" value={test.maxMeses} onChange={e => setTest({ ...test, maxMeses: Number(e.target.value) })} />
                    </div>
                </div>
                <label className="flex items-center gap-3 md:col-span-2">
                    <input type="checkbox" className="h-5 w-5 accent-brand-600" checked={test.activo} onChange={e => setTest({ ...test, activo: e.target.checked })} />
                    <span>Cuestionario activo (se asigna a los niños de esa edad)</span>
                </label>
                <p className="text-sm text-tinta-suave md:col-span-2">
                    Puntaje máximo posible: <strong>{maximo}</strong>. La clasificación es 0–5 desarrollo esperado, 6–10 riesgo leve y 11 o más riesgo alto.
                    {test.evaluaciones > 0 && ` Este cuestionario ya tiene ${test.evaluaciones} evaluaciones; los cambios solo aplican a las nuevas.`}
                </p>
            </header>

            <ol className="space-y-4">
                {test.preguntas.map((p, i) => (
                    <li key={i} className="tarjeta space-y-4">
                        <div>
                            <label htmlFor={`p${i}`} className="etiqueta">Pregunta {i + 1}</label>
                            <textarea id={`p${i}`} rows={2} className="campo mt-2" value={p.pregunta} onChange={e => cambiarPregunta(i, { pregunta: e.target.value })} />
                        </div>

                        <fieldset>
                            <legend className="etiqueta mb-2">Opciones y puntaje</legend>
                            <div className="space-y-2">
                                {p.opciones.map((o, k) => (
                                    <div key={k} className="flex items-center gap-2">
                                        <input aria-label={`Opción ${k + 1}`} className="campo flex-1 py-2" value={o.respuesta} onChange={e => cambiarOpcion(i, k, 'respuesta', e.target.value)} />
                                        <input aria-label={`Puntaje de la opción ${k + 1}`} type="number" min={0} max={10} className="campo w-24 py-2" value={o.puntaje} onChange={e => cambiarOpcion(i, k, 'puntaje', e.target.value)} />
                                        <button type="button" disabled={p.opciones.length <= 2} onClick={() => cambiarPregunta(i, { opciones: p.opciones.filter((_, j) => j !== k) })} className="rounded-full p-2 text-rosa-fuerte hover:bg-rosa-suave disabled:opacity-30" aria-label="Quitar opción">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => cambiarPregunta(i, { opciones: [...p.opciones, { respuesta: '', puntaje: 0 }] })} className="boton-secundario mt-2 px-4 py-2 text-sm">
                                <Plus className="h-4 w-4" aria-hidden />Agregar opción
                            </button>
                        </fieldset>

                        <div>
                            <label htmlFor={`r${i}`} className="etiqueta">Recomendación si la respuesta suma puntos (opcional)</label>
                            <textarea id={`r${i}`} rows={2} className="campo mt-2" placeholder="Ej.: Evite usar pantallas durante las comidas compartidas."
                                value={p.recomendacion ?? ''} onChange={e => cambiarPregunta(i, { recomendacion: e.target.value })} />
                        </div>
                    </li>
                ))}
            </ol>

            <div className="sticky bottom-4 flex justify-end">
                <button type="submit" disabled={isPending} className="boton shadow-suave">{isPending ? 'Guardando…' : 'Guardar cuestionario'}</button>
            </div>
        </form>
    );
}

export default function AdminCuestionariosView() {
    const { data, isLoading } = useQuery({ queryKey: ['admin', 'tests'], queryFn: getTestsAdmin });
    const [editando, setEditando] = useState<TestAdmin | null>(null);

    if (isLoading) return <Cargando />;
    if (editando) return <EditorCuestionario key={editando.id} inicial={editando} onVolver={() => setEditando(null)} />;

    return (
        <div className="space-y-6">
            <header>
                <h1 className="titulo-pagina">Cuestionarios</h1>
                <p className="mt-2 max-w-2xl text-tinta-suave">Cada rango de edad tiene exactamente 10 preguntas cerradas. Puedes cambiar el texto, las opciones, los puntajes y la recomendación que aparece según la respuesta.</p>
            </header>
            <ul className="space-y-3">
                {data?.map(t => (
                    <li key={t.id} className="tarjeta flex flex-wrap items-center gap-4">
                        <div className="min-w-0 flex-1">
                            <p className="font-extrabold">{t.name}</p>
                            <p className="text-sm text-tinta-suave">
                                {t.minMeses}–{t.maxMeses} meses · {t.evaluaciones} evaluaciones · {t.preguntas.filter(p => p.recomendacion).length} preguntas con recomendación
                            </p>
                        </div>
                        {!t.activo && <span className="rounded-full bg-lavanda px-3 py-1 text-sm font-bold text-tinta-suave">Inactivo</span>}
                        <button onClick={() => setEditando(t)} className="boton px-5 py-2.5">Editar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
