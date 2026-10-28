import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { getRecentEvaluations } from '../api/KidAPI';
import NivelBadge from '../components/NivelBadge';
import { nivelDe } from '../lib/nivel';
import Cargando from '../components/Cargando';
import type { TestHistory } from '../types';

const fecha = (valor: string) => new Date(valor).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ResultadosView() {
    const { data, isLoading, isError } = useQuery<TestHistory[] | undefined>({ queryKey: ['recientes'], queryFn: getRecentEvaluations });

    return (
        <div className="space-y-6">
            <header>
                <h1 className="titulo-pagina">Resultados</h1>
                <p className="mt-2 max-w-2xl text-tinta-suave">Abre cualquier evaluación para ver de nuevo su resultado, los indicadores y las recomendaciones que se entregaron.</p>
            </header>

            {isLoading && <Cargando />}
            {isError && <p className="tarjeta text-rosa-fuerte">No se pudieron cargar los resultados.</p>}
            {data?.length === 0 && (
                <div className="tarjeta space-y-4 text-center">
                    <p className="text-tinta-suave">Todavía no hay evaluaciones. Cuando completes la primera, su resultado aparecerá aquí.</p>
                    <Link to="/evaluacion" className="boton">Comenzar evaluación</Link>
                </div>
            )}
            {data && data.length > 0 && (
                <ul className="space-y-3">
                    {data.map(ev => (
                        <li key={ev.id}>
                            <Link to={`/dashboard/kid/${ev.kid?.id}/evaluacion/${ev.id}`} className="tarjeta flex flex-wrap items-center gap-4 hover:ring-2 hover:ring-brand-200">
                                <div className="min-w-0 flex-1">
                                    <p className="text-lg font-extrabold">{ev.kid?.name}</p>
                                    <p className="text-sm text-tinta-suave">{fecha(ev.createdAt)}{ev.edadTexto ? ` · ${ev.edadTexto}` : ''}{ev.test?.rango ? ` · ${ev.test.rango}` : ''}</p>
                                </div>
                                <span className="text-sm text-tinta-suave">{ev.puntaje} puntos</span>
                                <NivelBadge nivel={nivelDe(ev.nivel, ev.puntaje)} texto={ev.clasificacion} />
                                <ArrowRight className="h-5 w-5 text-tinta-tenue" aria-hidden />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
