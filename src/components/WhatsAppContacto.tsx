import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, X } from 'lucide-react';
import { getContactos } from '../api/KidAPI';
import type { Contacto } from '../types';

// Parámetros, sección X: el contacto es voluntario y el mensaje no incluye
// resultados ni datos personales del niño.
const MENSAJE = 'Hola, quisiera recibir información sobre una valoración fonoaudiológica.';
const enlace = (telefono: string) => `https://wa.me/${telefono}?text=${encodeURIComponent(MENSAJE)}`;

function SelectorFonoaudiologa({ contactos, onClose }: { contactos: Contacto[]; onClose: () => void }) {
    useEffect(() => {
        const alPresionar = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', alPresionar);
        return () => window.removeEventListener('keydown', alPresionar);
    }, [onClose]);
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="titulo-contacto">
            <div className="absolute inset-0 bg-tinta/40" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-[2rem] bg-white p-6 shadow-suave">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="titulo-contacto" className="font-mano text-3xl">¿Con quién quieres hablar?</h2>
                        <p className="mt-1 text-sm text-tinta-suave">Se abrirá WhatsApp con un saludo. No se envían resultados ni datos del niño o niña.</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-lavanda" aria-label="Cerrar">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <ul className="mt-5 space-y-3">
                    {contactos.map(c => (
                        <li key={c.id}>
                            <a
                                href={enlace(c.telefono)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={onClose}
                                className="flex items-center gap-4 rounded-2xl border border-brand-100 p-4 transition-colors hover:border-whatsapp hover:bg-menta-suave"
                            >
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-whatsapp text-white">
                                    <MessageCircle className="h-5 w-5" aria-hidden />
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-extrabold">{c.nombre}</span>
                                    {c.descripcion && <span className="block text-sm text-tinta-suave">{c.descripcion}</span>}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

type Props = { variante?: 'menu' | 'tarjeta' | 'boton' };

export default function WhatsAppContacto({ variante = 'boton' }: Props) {
    const [abierto, setAbierto] = useState(false);
    const { data: contactos = [] } = useQuery({ queryKey: ['contactos'], queryFn: getContactos, staleTime: 5 * 60 * 1000 });
    const disponible = contactos.length > 0;

    const abrir = () => {
        if (contactos.length === 1) window.open(enlace(contactos[0].telefono), '_blank', 'noopener,noreferrer');
        else setAbierto(true);
    };
    const comunes = {
        type: 'button' as const,
        onClick: abrir,
        disabled: !disponible,
        title: disponible ? undefined : 'Aún no hay fonoaudiólogas configuradas para el contacto'
    };

    let disparador;
    if (variante === 'menu') {
        disparador = (
            <button {...comunes} className="flex w-full items-center gap-3 rounded-2xl bg-menta-suave p-3 text-left text-sm font-semibold text-tinta transition-colors hover:bg-[#cfeee2] disabled:opacity-60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-whatsapp text-white">
                    <MessageCircle className="h-5 w-5" aria-hidden />
                </span>
                ¿Necesitas hablar con un fonoaudiólogo?
            </button>
        );
    } else if (variante === 'tarjeta') {
        disparador = (
            <div className="flex flex-col gap-4 rounded-3xl bg-brand-100 p-6 sm:flex-row sm:items-center">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-whatsapp text-white">
                    <MessageCircle className="h-7 w-7" aria-hidden />
                </span>
                <div className="flex-1">
                    <h3 className="font-mano text-2xl">¿Tienes dudas?</h3>
                    <p className="text-tinta-suave">
                        {disponible
                            ? 'Habla directamente con una fonoaudióloga y recibe orientación profesional.'
                            : 'Pronto podrás contactar a una fonoaudióloga desde aquí.'}
                    </p>
                </div>
                <button {...comunes} className="boton bg-whatsapp hover:bg-whatsapp-fuerte">Contactar por WhatsApp</button>
            </div>
        );
    } else {
        disparador = (
            <button {...comunes} className="boton bg-whatsapp hover:bg-whatsapp-fuerte">
                <MessageCircle className="h-5 w-5" aria-hidden />
                Contactar por WhatsApp
            </button>
        );
    }

    return (
        <>
            {disparador}
            {abierto && <SelectorFonoaudiologa contactos={contactos} onClose={() => setAbierto(false)} />}
        </>
    );
}
