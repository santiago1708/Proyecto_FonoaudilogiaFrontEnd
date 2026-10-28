import type { ActividadFamilia, ActividadProfesional } from '../types';

const Bloque = ({ titulo, children }: { titulo: string; children: React.ReactNode }) => (
    <div>
        <h4 className="font-bold text-tinta">{titulo}</h4>
        <div className="mt-1 text-tinta-suave">{children}</div>
    </div>
);

export function ActividadFamiliaCard({ actividad }: { actividad: ActividadFamilia }) {
    return (
        <article className="tarjeta space-y-4">
            <header>
                <h3 className="font-mano text-2xl leading-tight">{actividad.nombre}</h3>
                <p className="mt-1 text-tinta-suave"><span className="font-bold text-tinta">Objetivo:</span> {actividad.objetivo}</p>
            </header>
            <Bloque titulo="¿Cómo realizarla?">
                <ol className="list-decimal space-y-1 pl-5">
                    {actividad.pasos.map(paso => <li key={paso}>{paso}</li>)}
                </ol>
            </Bloque>
            <Bloque titulo="Materiales">{actividad.materiales}</Bloque>
            <p className="rounded-2xl bg-sol-suave p-4 text-tinta"><span className="font-bold">Recomendación:</span> {actividad.recomendacion}</p>
        </article>
    );
}

export function ActividadProfesionalCard({ actividad }: { actividad: ActividadProfesional }) {
    return (
        <article className="tarjeta space-y-4">
            <header>
                <h3 className="font-mano text-2xl leading-tight">{actividad.nombre}</h3>
                <p className="mt-1 text-tinta-suave"><span className="font-bold text-tinta">Objetivo:</span> {actividad.objetivo}</p>
            </header>
            <Bloque titulo="Procedimiento">
                <ol className="list-decimal space-y-1 pl-5">
                    {actividad.procedimiento.map(paso => <li key={paso}>{paso}</li>)}
                </ol>
            </Bloque>
            <Bloque titulo="Aspectos por observar">{actividad.aspectos}</Bloque>
            {actividad.orientacionFamiliar && (
                <p className="rounded-2xl bg-menta-suave p-4"><span className="font-bold">Orientación familiar:</span> {actividad.orientacionFamiliar}</p>
            )}
            {actividad.orientacionProfesional && (
                <p className="rounded-2xl bg-cielo-suave p-4"><span className="font-bold">Orientación profesional:</span> {actividad.orientacionProfesional}</p>
            )}
            {actividad.precaucion && (
                <p className="rounded-2xl bg-sol-suave p-4"><span className="font-bold">Precaución:</span> {actividad.precaucion}</p>
            )}
        </article>
    );
}
