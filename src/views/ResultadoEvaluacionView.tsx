import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, TrendingDown, TrendingUp, Minus, Sparkles } from 'lucide-react';
import { getEvaluation } from '../api/KidAPI';
import NivelBadge from '../components/NivelBadge';
import { nivelDe } from '../lib/nivel';
import AvisoOrientativo from '../components/AvisoOrientativo';
import WhatsAppContacto from '../components/WhatsAppContacto';
import Cargando from '../components/Cargando';
import { ListaActividades, ListaRecomendaciones } from '../components/BloqueRecomendaciones';

const COLOR_NIVEL = { esperado: 'bg-menta-suave', leve: 'bg-sol-suave', alto: 'bg-rosa-suave' } as const;
const PUNTAJE_COLOR = { esperado: 'text-menta-fuerte', leve: 'text-sol-fuerte', alto: 'text-rosa-fuerte' } as const;

const ICONO_PROGRESO: Record<string, typeof Minus> = {
    'Mejora': TrendingDown,
    'Empeoramiento': TrendingUp,
    'Sin cambios': Minus,
    'Primera evaluación': Sparkles
};

const Seccion = ({ titulo, children }: { titulo: string; children: React.ReactNode }) => (
    <section className="space-y-4">
        <h2 className="titulo-seccion">{titulo}</h2>
        {children}
    </section>
);

export default function ResultadoEvaluacionView() {
    const { id, evaluacionId } = useParams<{ id: string; evaluacionId: string }>();
    const { data, isLoading, isError } = useQuery({
        queryKey: ['evaluacion', id, evaluacionId],
        queryFn: () => getEvaluation(id!, evaluacionId!),
        enabled: !!id && !!evaluacionId
    });

    if (isLoading) return <Cargando texto="Cargando resultado…" />;
    if (isError || !data) return <p className="tarjeta text-rosa-fuerte">No se encontró esta evaluación.</p>;

    const { evaluacion: ev, niño } = data;
    const nivel = nivelDe(ev.nivel, ev.puntaje);
    const rec = ev.recomendaciones;
    const esProfesional = (rec?.perfil ?? ev.perfilUsuario) === 'profesional';
    const IconoProgreso = ICONO_PROGRESO[ev.progreso ?? ''] ?? Minus;
    const fecha = new Date(ev.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="mx-auto max-w-4xl space-y-10">
            <Link to={`/dashboard/kid/${id}`} className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Seguimiento de {niño.name}
            </Link>

            {/* 1. Resultado de la evaluación */}
            <section className={`rounded-[2rem] p-6 sm:p-10 ${COLOR_NIVEL[nivel]}`}>
                <p className="text-tinta-suave">
                    {niño.name} · {ev.edadTexto ?? '—'} · {fecha}
                </p>
                <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-4">
                    <div>
                        <p className={`font-mano text-7xl leading-none ${PUNTAJE_COLOR[nivel]}`}>{ev.puntaje}</p>
                        <p className="text-sm font-semibold text-tinta-suave">puntos</p>
                    </div>
                    <div className="flex-1">
                        <NivelBadge nivel={nivel} texto={ev.clasificacion} sobreColor />
                        <p className="mt-3 max-w-xl text-lg font-semibold">{ev.mensaje ?? rec?.mensaje}</p>
                    </div>
                </div>
                <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                    <div><dt className="text-tinta-suave">Cuestionario</dt><dd className="font-bold">{ev.test?.rango ?? ev.test?.name}</dd></div>
                    <div><dt className="text-tinta-suave">Respondió</dt><dd className="font-bold">{ev.personaResponde ?? '—'}</dd></div>
                    <div><dt className="text-tinta-suave">Pantallas al día</dt><dd className="font-bold">{ev.tiempoPantallas ?? '—'}</dd></div>
                </dl>
            </section>

            {/* 2. Indicadores identificados */}
            <Seccion titulo="Indicadores identificados">
                {ev.indicadores?.length ? (
                    <ul className="space-y-3">
                        {ev.indicadores.map(ind => (
                            <li key={ind.idPregunta} className="tarjeta flex flex-wrap items-center justify-between gap-3">
                                <span className="flex-1">{ind.pregunta}</span>
                                <span className="rounded-full bg-lavanda px-3 py-1 text-sm font-bold">
                                    {ind.respuesta} · {ind.puntaje} {ind.puntaje === 1 ? 'punto' : 'puntos'}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="tarjeta text-tinta-suave">Ninguna respuesta sumó puntos de alerta.</p>
                )}
            </Seccion>

            {/* 3. Recomendaciones personalizadas */}
            {rec && (
                <Seccion titulo="Recomendaciones personalizadas">
                    <ListaRecomendaciones bloque={rec} />
                </Seccion>
            )}

            {/* 4. Actividades para realizar */}
            {rec && (
                <Seccion titulo={esProfesional ? 'Actividades de apoyo profesional' : 'Actividades para realizar'}>
                    <ListaActividades bloque={rec} />
                </Seccion>
            )}
            {!rec && (
                <p className="tarjeta text-tinta-suave">Esta evaluación se hizo con la versión anterior de FonoAlerta, que no guardaba recomendaciones.</p>
            )}

            {/* 5. Seguimiento */}
            <Seccion titulo="Seguimiento">
                <div className="tarjeta flex flex-wrap items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-brand-700">
                        <IconoProgreso className="h-6 w-6" aria-hidden />
                    </span>
                    <p className="flex-1">{ev.mensajeProgreso ?? 'Sin comparación disponible.'}</p>
                    <Link to={`/dashboard/kid/${id}`} className="boton-secundario">Ver historial y gráfica</Link>
                </div>
            </Seccion>

            {/* 6. Consulta profesional */}
            <Seccion titulo="Consulta profesional">
                <WhatsAppContacto variante="tarjeta" />
            </Seccion>

            <AvisoOrientativo texto={rec?.aviso} />
        </div>
    );
}
