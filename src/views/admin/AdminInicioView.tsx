import { Link } from 'react-router-dom';
import { ClipboardList, Lightbulb, Puzzle, MessageCircle, ShieldCheck } from 'lucide-react';

const SECCIONES = [
    { to: '/admin/cuestionarios', titulo: 'Cuestionarios', texto: 'Preguntas, opciones, puntajes y recomendación por respuesta de cada rango de edad.', icono: ClipboardList, fondo: 'bg-menta-suave', acento: 'bg-menta' },
    { to: '/admin/recomendaciones', titulo: 'Recomendaciones', texto: 'Lo que se recomienda según el resultado, para familias y profesionales.', icono: Lightbulb, fondo: 'bg-sol-suave', acento: 'bg-sol' },
    { to: '/admin/actividades', titulo: 'Actividades', texto: 'Actividades por rango de edad para familias y profesionales.', icono: Puzzle, fondo: 'bg-cielo-suave', acento: 'bg-cielo' },
    { to: '/admin/contactos', titulo: 'Contactos de WhatsApp', texto: 'Fonoaudiólogas que los usuarios pueden elegir para escribir.', icono: MessageCircle, fondo: 'bg-rosa-suave', acento: 'bg-rosa' },
    { to: '/admin/administradores', titulo: 'Administradores', texto: 'Quién puede entrar a este panel.', icono: ShieldCheck, fondo: 'bg-brand-100', acento: 'bg-brand-500' }
];

export default function AdminInicioView() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="titulo-pagina">Administración</h1>
                <p className="mt-2 max-w-2xl text-tinta-suave">Los cambios aplican a las evaluaciones nuevas. Las evaluaciones ya hechas conservan las preguntas, respuestas y recomendaciones que se mostraron en su momento.</p>
            </header>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SECCIONES.map(({ to, titulo, texto, icono: Icono, fondo, acento }) => (
                    <Link key={to} to={to} className={`flex flex-col rounded-3xl ${fondo} p-6 transition-transform hover:-translate-y-0.5`}>
                        <span className={`grid h-12 w-12 place-items-center rounded-full ${acento} text-white`}><Icono className="h-6 w-6" aria-hidden /></span>
                        <h2 className="mt-4 text-lg font-extrabold">{titulo}</h2>
                        <p className="mt-1 text-sm text-tinta-suave">{texto}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
