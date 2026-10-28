import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ClipboardCheck, BarChart3, Lightbulb, Puzzle, CalendarDays, Plus, ArrowRight } from 'lucide-react';
import { getKids } from '../api/KidAPI';
import type { Kid } from '../types';
import KidCardSkeleton from '../components/KidCardSkeleton';
import WhatsAppContacto from '../components/WhatsAppContacto';
import { useUsuario } from '../hooks/useUsuario';

export default function DashboardView() {
    const { user, esProfesional } = useUsuario();
    const { data: kids, isLoading, isError } = useQuery<Kid[]>({ queryKey: ['kids'], queryFn: getKids });

    const quien = esProfesional ? 'sus pacientes' : 'tu hijo(a)';
    const accesos = [
        { to: '/evaluacion', titulo: 'Evaluación', texto: `Responde el cuestionario según la edad de ${quien}.`, icono: ClipboardCheck, fondo: 'bg-menta-suave', acento: 'bg-menta' },
        { to: '/resultados', titulo: 'Resultados', texto: 'Conoce el nivel de riesgo y el estado del desarrollo.', icono: BarChart3, fondo: 'bg-brand-100', acento: 'bg-brand-500' },
        { to: '/recomendaciones', titulo: 'Recomendaciones', texto: 'Recibe orientación según el resultado.', icono: Lightbulb, fondo: 'bg-sol-suave', acento: 'bg-sol' },
        { to: '/actividades', titulo: 'Actividades', texto: esProfesional ? 'Estrategias de observación y orientación por edad.' : 'Ejercicios para hacer en casa o en el aula.', icono: Puzzle, fondo: 'bg-cielo-suave', acento: 'bg-cielo' },
        { to: '/seguimiento', titulo: 'Seguimiento', texto: `Visualiza el progreso de ${quien} en el tiempo.`, icono: CalendarDays, fondo: 'bg-rosa-suave', acento: 'bg-rosa' }
    ];

    return (
        <div className="space-y-10">
            <section>
                <p className="font-mano text-3xl">¡Hola, {user?.name?.split(' ')[0]}!</p>
                <p className="mt-1 max-w-xl text-tinta-suave">
                    {esProfesional
                        ? 'Aquí encontrarás herramientas de apoyo para la identificación temprana de señales de alerta en el lenguaje.'
                        : 'Gracias por ser parte de este proceso. Aquí encontrarás herramientas para acompañar el desarrollo del lenguaje de tu niño o niña.'}
                </p>
            </section>

            {/* Portada */}
            <section className="relative overflow-hidden rounded-[2rem] bg-white shadow-suave">
                <div className="grid items-center gap-6 p-6 sm:p-10 md:grid-cols-[1.1fr_1fr]">
                    <div>
                        <h1 className="font-mano text-5xl leading-[0.95] sm:text-6xl">Cada palabra cuenta</h1>
                        <p className="mt-4 max-w-md text-lg text-tinta-suave">
                            Detectar a tiempo puede hacer la diferencia en su desarrollo.
                        </p>
                        <Link to="/evaluacion" className="boton mt-6">
                            Comenzar evaluación
                            <ArrowRight className="h-5 w-5" aria-hidden />
                        </Link>
                    </div>
                    <div className="relative mx-auto w-full max-w-sm">
                        <div className="absolute inset-6 rounded-full bg-brand-100" aria-hidden />
                        <img src="/ilustracion-nino.png" alt="" className="relative w-full" />
                    </div>
                </div>
            </section>

            {/* Accesos rápidos */}
            <section aria-labelledby="que-hacer">
                <h2 id="que-hacer" className="titulo-seccion mb-4">¿Qué quieres hacer hoy?</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
                    {accesos.map(({ to, titulo, texto, icono: Icono, fondo, acento }) => (
                        <Link key={to} to={to} className={`group flex flex-col rounded-3xl ${fondo} p-5 transition-transform hover:-translate-y-0.5`}>
                            <span className={`grid h-14 w-14 place-items-center rounded-full ${acento} text-white`}>
                                <Icono className="h-7 w-7" aria-hidden />
                            </span>
                            <h3 className="mt-4 hyphens-auto text-base font-extrabold xl:text-lg">{titulo}</h3>
                            <p className="mt-1 hidden flex-1 text-sm text-tinta-suave sm:block">{texto}</p>
                            <ArrowRight className="mt-4 h-5 w-5 text-tinta-suave group-hover:text-tinta" aria-hidden />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Niños registrados */}
            <section aria-labelledby="mis-ninos">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <h2 id="mis-ninos" className="titulo-seccion">{esProfesional ? 'Mis pacientes' : 'Mis niños'}</h2>
                    <Link to="/dashboard/add-kid" className="boton-secundario">
                        <Plus className="h-5 w-5" aria-hidden />
                        Registrar niño o niña
                    </Link>
                </div>

                {isLoading && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => <KidCardSkeleton key={i} />)}
                    </div>
                )}
                {isError && <p className="tarjeta text-rosa-fuerte">No se pudo cargar la lista. Recarga la página para intentarlo de nuevo.</p>}
                {kids && kids.length === 0 && (
                    <div className="tarjeta text-center">
                        <p className="text-tinta-suave">Aún no hay perfiles registrados. Registra uno para hacer la primera evaluación.</p>
                    </div>
                )}
                {kids && kids.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {kids.map(kid => (
                            <Link key={kid.id} to={`/dashboard/kid/${kid.id}`} className="tarjeta flex items-center gap-4 hover:ring-2 hover:ring-brand-200">
                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-100 font-mano text-2xl text-brand-700">
                                    {kid.name.charAt(0).toUpperCase()}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-lg font-extrabold">{kid.name}</p>
                                    <p className="text-sm text-tinta-suave">{kid.edadCalculada} · {kid.genero}</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-tinta-tenue" aria-hidden />
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <div className="flex items-center gap-5 rounded-3xl bg-menta-suave p-6">
                    <img src="/ilustracion-nino.png" alt="" className="hidden h-24 w-auto sm:block" />
                    <div>
                        <h3 className="font-mano text-2xl">¿Sabías que…?</h3>
                        <p className="text-tinta-suave">La sobreexposición a pantallas puede influir en el desarrollo del lenguaje. Conversar, jugar y leer juntos lo fortalece.</p>
                        <Link to="/recomendaciones" className="mt-2 inline-block font-bold text-menta-fuerte underline-offset-4 hover:underline">
                            Ver recomendaciones
                        </Link>
                    </div>
                </div>
                <WhatsAppContacto variante="tarjeta" />
            </section>
        </div>
    );
}
