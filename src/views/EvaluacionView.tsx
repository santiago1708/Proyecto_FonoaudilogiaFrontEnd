import SelectorNino from '../components/SelectorNino';
import { useUsuario } from '../hooks/useUsuario';

export default function EvaluacionView() {
    const { esProfesional } = useUsuario();
    return (
        <SelectorNino
            titulo="Evaluación"
            descripcion={`Elige ${esProfesional ? 'al paciente' : 'al niño o niña'}. El cuestionario de 10 preguntas se asigna automáticamente según su edad.`}
            accion="Evaluar"
            destino={kid => `/dashboard/kid/${kid.id}/evaluate`}
        />
    );
}
