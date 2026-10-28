import type { BloqueRecomendaciones as Bloque } from '../types';
import { ActividadFamiliaCard, ActividadProfesionalCard } from './Actividades';

// Recomendaciones según el resultado y, si las hay, según las respuestas que sumaron puntos
const FONDO_NIVEL = { esperado: 'bg-menta-suave', leve: 'bg-sol-suave', alto: 'bg-rosa-suave' } as const;

export function ListaRecomendaciones({ bloque, mostrarMensaje = false }: { bloque: Bloque; mostrarMensaje?: boolean }) {
    const esProfesional = bloque.perfil === 'profesional';
    const intro = esProfesional ? bloque.introduccion : bloque.objetivo;
    return (
        <div className="space-y-4">
            {mostrarMensaje && (
                <p className={`rounded-3xl p-5 text-lg font-semibold ${FONDO_NIVEL[bloque.nivel]}`}>{bloque.mensaje}</p>
            )}
            <div className="tarjeta">
                {intro && (esProfesional
                    ? <p className="text-tinta-suave">{intro}</p>
                    : <p><span className="font-bold">Objetivo:</span> {intro}</p>)}
                {!!bloque.recomendaciones?.length && (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-tinta-suave">
                        {bloque.recomendaciones.map(r => <li key={r}>{r}</li>)}
                    </ul>
                )}
            </div>
            {!!bloque.porRespuesta?.length && (
                <div className="tarjeta">
                    <h3 className="font-bold">Según las respuestas</h3>
                    <ul className="mt-3 space-y-3">
                        {bloque.porRespuesta.map(r => (
                            <li key={r.idPregunta} className="rounded-2xl bg-lavanda p-4">
                                <p className="text-sm text-tinta-suave">{r.pregunta} <span className="font-bold text-tinta">{r.respuesta}</span></p>
                                <p className="mt-1 font-semibold">{r.recomendacion}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export function ListaActividades({ bloque }: { bloque: Bloque }) {
    const lista = bloque.perfil === 'profesional' ? bloque.actividadesProfesional : bloque.actividadesFamilia;
    if (!lista?.length) return <p className="tarjeta text-tinta-suave">No hay actividades registradas para este rango de edad.</p>;
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {bloque.perfil === 'profesional'
                ? bloque.actividadesProfesional!.map(a => <ActividadProfesionalCard key={a.nombre} actividad={a} />)
                : bloque.actividadesFamilia!.map(a => <ActividadFamiliaCard key={a.nombre} actividad={a} />)}
        </div>
    );
}
