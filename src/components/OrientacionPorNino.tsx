import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { getKidRecommendations, getKids, getRecentEvaluations } from '../api/KidAPI';
import type { Kid } from '../types';
import { nivelDe } from '../lib/nivel';
import NivelBadge from './NivelBadge';
import Cargando from './Cargando';
import AvisoOrientativo from './AvisoOrientativo';
import { ListaActividades, ListaRecomendaciones } from './BloqueRecomendaciones';

const fecha = (valor: string) => new Date(valor).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

type Props = { tipo: 'recomendaciones' | 'actividades'; titulo: string; descripcion: string };

// Muestra, por niño, lo entregado en su última evaluación y el historial de evaluaciones anteriores
export default function OrientacionPorNino({ tipo, titulo, descripcion }: Props) {
    const [kidId, setKidId] = useState<number | null>(null);
    const [abierta, setAbierta] = useState<number | null>(null);
    const { data: kids, isLoading } = useQuery<Kid[]>({ queryKey: ['kids'], queryFn: getKids });
    // Por defecto se abre el niño con la evaluación más reciente
    const { data: recientes, isLoading: cargandoRecientes } = useQuery({ queryKey: ['recientes'], queryFn: getRecentEvaluations });
    const seleccionado = kidId ?? recientes?.[0]?.kid?.id ?? (cargandoRecientes ? null : kids?.[0]?.id ?? null);

    const { data, isLoading: cargando } = useQuery({
        queryKey: ['recomendacionesKid', seleccionado],
        queryFn: () => getKidRecommendations(String(seleccionado)),
        enabled: seleccionado !== null
    });

    const evaluaciones = (data?.evaluaciones ?? []).filter(e => e.recomendaciones);
    const [ultima, ...anteriores] = evaluaciones;

    return (
        <div className="space-y-6">
            <header>
                <h1 className="titulo-pagina">{titulo}</h1>
                <p className="mt-2 max-w-2xl text-tinta-suave">{descripcion}</p>
            </header>

            {isLoading && <Cargando />}
            {kids?.length === 0 && (
                <div className="tarjeta space-y-4 text-center">
                    <p className="text-tinta-suave">Registra un niño o niña y haz su primera evaluación para ver {tipo} aquí.</p>
                    <Link to="/dashboard/add-kid" className="boton">Registrar niño o niña</Link>
                </div>
            )}

            {kids && kids.length > 1 && (
                <div role="tablist" aria-label="Niño o niña" className="flex flex-wrap gap-2">
                    {kids.map(k => (
                        <button
                            key={k.id}
                            role="tab"
                            aria-selected={k.id === seleccionado}
                            onClick={() => { setKidId(k.id); setAbierta(null); }}
                            className={`rounded-full px-4 py-2 font-bold transition-colors ${k.id === seleccionado ? 'bg-brand-600 text-white' : 'bg-white text-tinta hover:bg-brand-50'}`}
                        >
                            {k.name}
                        </button>
                    ))}
                </div>
            )}

            {seleccionado !== null && cargando && <Cargando />}

            {seleccionado !== null && !cargando && !ultima && (
                <div className="tarjeta space-y-4 text-center">
                    <p className="text-tinta-suave">{data?.niño.name ?? 'Este niño o niña'} aún no tiene evaluaciones. Al completar la primera verás aquí sus {tipo}.</p>
                    <Link to={`/dashboard/kid/${seleccionado}/evaluate`} className="boton">Hacer evaluación</Link>
                </div>
            )}

            {ultima && (
                <section aria-labelledby="ultima" className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 id="ultima" className="titulo-seccion">Última evaluación</h2>
                        <NivelBadge nivel={nivelDe(ultima.nivel, ultima.puntaje)} texto={ultima.clasificacion} />
                        <span className="text-sm text-tinta-suave">{fecha(ultima.createdAt)}{ultima.edadTexto ? ` · ${ultima.edadTexto}` : ''}</span>
                        <Link to={`/dashboard/kid/${seleccionado}/evaluacion/${ultima.id}`} className="ml-auto font-bold text-brand-700 hover:underline">Ver resultado completo</Link>
                    </div>
                    {tipo === 'recomendaciones'
                        ? <ListaRecomendaciones bloque={ultima.recomendaciones!} mostrarMensaje />
                        : <ListaActividades bloque={ultima.recomendaciones!} />}
                    {/* En Recomendaciones va el aviso orientativo general; en Actividades, el del perfil */}
                    <AvisoOrientativo texto={tipo === 'actividades' ? ultima.recomendaciones!.aviso : undefined} />
                </section>
            )}

            {anteriores.length > 0 && (
                <section aria-labelledby="historial" className="space-y-3">
                    <h2 id="historial" className="titulo-seccion">Evaluaciones anteriores</h2>
                    {anteriores.map(ev => {
                        const expandida = abierta === ev.id;
                        return (
                            <div key={ev.id} className="tarjeta p-0">
                                <button
                                    onClick={() => setAbierta(expandida ? null : ev.id)}
                                    aria-expanded={expandida}
                                    className="flex w-full flex-wrap items-center gap-3 p-5 text-left"
                                >
                                    <span className="font-bold">{fecha(ev.createdAt)}</span>
                                    {ev.edadTexto && <span className="text-sm text-tinta-suave">{ev.edadTexto}</span>}
                                    <NivelBadge nivel={nivelDe(ev.nivel, ev.puntaje)} texto={ev.clasificacion} />
                                    <ChevronDown className={`ml-auto h-5 w-5 transition-transform ${expandida ? 'rotate-180' : ''}`} aria-hidden />
                                </button>
                                {expandida && (
                                    <div className="border-t border-brand-100 bg-lavanda/60 p-5">
                                        {tipo === 'recomendaciones'
                                            ? <ListaRecomendaciones bloque={ev.recomendaciones!} mostrarMensaje />
                                            : <ListaActividades bloque={ev.recomendaciones!} />}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>
            )}
        </div>
    );
}
