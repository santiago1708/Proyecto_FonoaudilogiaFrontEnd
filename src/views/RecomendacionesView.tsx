import OrientacionPorNino from '../components/OrientacionPorNino';

export default function RecomendacionesView() {
    return (
        <OrientacionPorNino
            tipo="recomendaciones"
            titulo="Recomendaciones"
            descripcion="Orientaciones según la edad y el resultado de cada evaluación. Arriba ves las más recientes; abajo, las de evaluaciones anteriores."
        />
    );
}
