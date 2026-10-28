import SelectorNino from '../components/SelectorNino';

export default function SeguimientoView() {
    return (
        <SelectorNino
            titulo="Seguimiento"
            descripcion="Consulta el historial de evaluaciones, compara resultados y mira la gráfica de evolución."
            accion="Ver seguimiento"
            destino={kid => `/dashboard/kid/${kid.id}`}
        />
    );
}
