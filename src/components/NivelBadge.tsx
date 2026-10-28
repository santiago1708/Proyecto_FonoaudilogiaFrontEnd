import type { Nivel } from '../types';

const ESTILOS: Record<Nivel, string> = {
    esperado: 'bg-menta-suave text-menta-fuerte',
    leve: 'bg-sol-suave text-sol-fuerte',
    alto: 'bg-rosa-suave text-rosa-fuerte'
};

export default function NivelBadge({ nivel, texto, sobreColor = false }: { nivel: Nivel; texto: string; sobreColor?: boolean }) {
    // Sobre un fondo del mismo color se usa una etiqueta blanca para que se distinga
    const estilo = sobreColor ? `bg-white ${ESTILOS[nivel].split(' ')[1]}` : ESTILOS[nivel];
    return (
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${estilo}`}>
            {texto}
        </span>
    );
}
