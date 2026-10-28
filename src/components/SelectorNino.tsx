import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getKids } from '../api/KidAPI';
import type { Kid } from '../types';
import Cargando from './Cargando';

type Props = {
    titulo: string;
    descripcion: string;
    accion: string;
    destino: (kid: Kid) => string;
};

// Lista de niños para elegir a quién evaluar o a quién hacer seguimiento
export default function SelectorNino({ titulo, descripcion, accion, destino }: Props) {
    const { data: kids, isLoading, isError } = useQuery<Kid[]>({ queryKey: ['kids'], queryFn: getKids });

    return (
        <div className="space-y-6">
            <header>
                <h1 className="titulo-pagina">{titulo}</h1>
                <p className="mt-2 max-w-2xl text-tinta-suave">{descripcion}</p>
            </header>

            {isLoading && <Cargando />}
            {isError && <p className="tarjeta text-rosa-fuerte">No se pudo cargar la lista. Recarga la página para intentarlo de nuevo.</p>}
            {kids?.length === 0 && (
                <div className="tarjeta space-y-4 text-center">
                    <p className="text-tinta-suave">Primero registra al niño o niña para poder continuar.</p>
                    <Link to="/dashboard/add-kid" className="boton"><Plus className="h-5 w-5" aria-hidden />Registrar niño o niña</Link>
                </div>
            )}
            {kids && kids.length > 0 && (
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {kids.map(kid => (
                        <li key={kid.id} className="tarjeta flex flex-wrap items-center gap-4">
                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-100 font-mano text-2xl text-brand-700">
                                {kid.name.charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-lg font-extrabold">{kid.name}</p>
                                <p className="text-sm text-tinta-suave">{kid.edadCalculada}</p>
                            </div>
                            <Link to={destino(kid)} className="boton px-5 py-2.5">{accion}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
