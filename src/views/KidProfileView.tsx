import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { toast } from 'sonner';
import { ArrowLeft, Pencil, Trash2, ClipboardCheck } from 'lucide-react';
import { deleteKid, getKidById, getKidHistory } from '../api/KidAPI';
import type { Kid, TestHistory } from '../types';
import ConfirmDeleteModal from '../components/ConfimDeleteModal';
import TestCardSkeleton from '../components/TestCardSkeleton';
import NivelBadge from '../components/NivelBadge';
import { nivelDe } from '../lib/nivel';

const fechaCorta = (valor: string) => new Date(valor).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

export default function KidProfileView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [modalAbierto, setModalAbierto] = useState(false);

    const { data: kid, isLoading: cargandoNino } = useQuery<Kid>({
        queryKey: ['kid', id],
        queryFn: () => getKidById(id!),
        enabled: !!id
    });

    const { data: history, isLoading: cargandoHistorial } = useQuery<TestHistory[]>({
        queryKey: ['kidHistory', id],
        queryFn: () => getKidHistory(id!),
        enabled: !!id
    });

    const { mutate: eliminar } = useMutation({
        mutationFn: deleteKid,
        onError: (error: Error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('Perfil eliminado');
            queryClient.invalidateQueries({ queryKey: ['kids'] });
            queryClient.invalidateQueries({ queryKey: ['recientes'] });
            navigate('/dashboard');
        }
    });

    if (cargandoNino || cargandoHistorial) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <TestCardSkeleton key={i} />)}
            </div>
        );
    }
    if (!kid) return <p className="tarjeta text-rosa-fuerte">No se encontró este perfil.</p>;

    const evaluaciones = history ?? [];
    // De la más antigua a la más reciente para la gráfica
    const datosGrafica = [...evaluaciones].reverse().map(ev => ({
        fecha: fechaCorta(ev.createdAt),
        puntaje: ev.puntaje
    }));
    const maximo = Math.max(21, ...datosGrafica.map(d => d.puntaje));

    return (
        <div className="space-y-8">
            <Link to="/seguimiento" className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Seguimiento
            </Link>

            <header className="tarjeta flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-100 font-mano text-4xl text-brand-700">
                        {kid.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                        <h1 className="font-mano text-4xl leading-tight">{kid.name}</h1>
                        <p className="text-tinta-suave">
                            {kid.edadCalculada} · {kid.genero} · {kid.escolarizacion ? 'Escolarizado(a)' : 'No escolarizado(a)'}
                        </p>
                        {kid.observaciones && <p className="mt-1 text-sm text-tinta-suave">Observaciones: {kid.observaciones}</p>}
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link to={`/dashboard/kid/${id}/edit`} className="boton-secundario"><Pencil className="h-4 w-4" aria-hidden />Editar</Link>
                    <button onClick={() => setModalAbierto(true)} className="boton-secundario border-rosa/30 text-rosa-fuerte hover:bg-rosa-suave">
                        <Trash2 className="h-4 w-4" aria-hidden />Eliminar
                    </button>
                    <Link to={`/dashboard/kid/${id}/evaluate`} className="boton"><ClipboardCheck className="h-5 w-5" aria-hidden />Nueva evaluación</Link>
                </div>
            </header>

            <section className="tarjeta">
                <h2 className="titulo-seccion mb-1">Gráfica evolutiva</h2>
                <p className="mb-6 text-sm text-tinta-suave">Un puntaje más bajo indica menos señales de alerta. Las franjas marcan desarrollo esperado (0–5), riesgo leve (6–10) y riesgo alto (11 o más).</p>
                {datosGrafica.length > 0 ? (
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={datosGrafica} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                <ReferenceArea y1={0} y2={5} fill="#DFF4EC" fillOpacity={0.7} />
                                <ReferenceArea y1={5} y2={10} fill="#FFF2CC" fillOpacity={0.7} />
                                <ReferenceArea y1={10} y2={maximo} fill="#FBE4F0" fillOpacity={0.7} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E0F5" />
                                <XAxis dataKey="fecha" stroke="#4A5480" tick={{ fontSize: 12 }} padding={{ left: 20, right: 20 }} interval="preserveStartEnd" />
                                <YAxis domain={[0, maximo]} allowDecimals={false} stroke="#4A5480" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 6px 24px -12px rgba(31,42,92,.35)' }}
                                    formatter={(valor) => [`${valor} puntos`, 'Puntaje']}
                                />
                                <Line type="monotone" dataKey="puntaje" stroke="#6A4BC4" strokeWidth={3} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="py-10 text-center text-tinta-suave">Cuando haya evaluaciones, aquí verás cómo cambia el puntaje en el tiempo.</p>
                )}
            </section>

            <section className="tarjeta overflow-hidden p-0">
                <h2 className="titulo-seccion p-6 pb-2">Historial de evaluaciones</h2>
                {evaluaciones.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left">
                            <thead className="bg-lavanda text-sm">
                                <tr>
                                    <th className="p-4">Fecha</th>
                                    <th className="p-4">Edad</th>
                                    <th className="p-4">Puntaje</th>
                                    <th className="p-4">Clasificación</th>
                                    <th className="p-4">Comparación</th>
                                    <th className="p-4"><span className="sr-only">Acciones</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-100">
                                {evaluaciones.map(ev => (
                                    <tr key={ev.id}>
                                        <td className="p-4">{fechaCorta(ev.createdAt)}</td>
                                        <td className="p-4">{ev.edadTexto ?? '—'}</td>
                                        <td className="p-4 font-extrabold">{ev.puntaje}</td>
                                        <td className="p-4"><NivelBadge nivel={nivelDe(ev.nivel, ev.puntaje)} texto={ev.clasificacion} /></td>
                                        <td className="p-4 text-sm">{ev.progreso ?? '—'}</td>
                                        <td className="p-4 text-right">
                                            <Link to={`/dashboard/kid/${id}/evaluacion/${ev.id}`} className="font-bold text-brand-700 hover:underline">
                                                Ver resultado
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="p-6 pt-2 text-tinta-suave">Aún no hay evaluaciones. Usa “Nueva evaluación” para hacer la primera.</p>
                )}
            </section>

            <ConfirmDeleteModal
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onConfirm={() => eliminar(id!)}
                kidName={kid.name}
            />
        </div>
    );
}
