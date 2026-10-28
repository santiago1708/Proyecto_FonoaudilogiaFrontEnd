import type { Nivel } from '../types';

// Las evaluaciones antiguas no guardaban el nivel: se deduce del puntaje
export const nivelDe = (nivel: Nivel | null | undefined, puntaje: number): Nivel =>
    nivel ?? (puntaje <= 5 ? 'esperado' : puntaje <= 10 ? 'leve' : 'alto');
