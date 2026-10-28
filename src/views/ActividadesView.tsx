import OrientacionPorNino from '../components/OrientacionPorNino';
import { useUsuario } from '../hooks/useUsuario';

export default function ActividadesView() {
    const { esProfesional } = useUsuario();
    return (
        <OrientacionPorNino
            tipo="actividades"
            titulo="Actividades"
            descripcion={esProfesional
                ? 'Propuestas de apoyo según la edad y el resultado. Selecciónalas y adáptalas a cada niño.'
                : 'Actividades para hacer en casa, con materiales que ya tienes, según la edad y el resultado de cada evaluación.'}
        />
    );
}
