import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { getTestsForKid, submitEvaluation } from '../api/KidAPI';
import ErrorMessage from '../components/ErrorMessages';
import EvaluateKidSkeleton from '../components/EvaluateKidSkeleton';
import AvisoOrientativo from '../components/AvisoOrientativo';
import { useUsuario } from '../hooks/useUsuario';

interface Opcion { respuesta: string; puntaje: number }
interface Pregunta { id: number; pregunta: string; opciones: Opcion[] }
interface TestDisponible { id: number; name: string; rango?: string; preguntas: Pregunta[] }
interface TestsResponse { niño: string; edadMeses: number; edadTexto: string; testsDisponibles: TestDisponible[] }

const PERSONAS = ['Madre', 'Padre', 'Cuidador', 'Profesional'];
const TIEMPOS = ['No usa', 'Menos de 1 hora', '1–2 horas', 'Más de 2 horas'];

type Formulario = Record<string, string>;

const Opciones = ({ nombre, opciones, registro }: { nombre: string; opciones: string[]; registro: UseFormRegisterReturn }) => (
    <div className="flex flex-wrap gap-3">
        {opciones.map(op => (
            <label key={op} className="cursor-pointer">
                <input type="radio" value={op} {...registro} className="peer sr-only" name={nombre} />
                <span className="inline-block rounded-full border-2 border-brand-200 bg-white px-5 py-2 font-semibold transition-colors peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600 hover:border-brand-400">
                    {op}
                </span>
            </label>
        ))}
    </div>
);

export default function EvaluateKidView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useUsuario();

    const { data, isLoading, isError } = useQuery<TestsResponse>({
        queryKey: ['availableTest', id],
        queryFn: () => getTestsForKid(id!),
        enabled: !!id
    });

    const { register, handleSubmit, formState: { errors } } = useForm<Formulario>({
        values: user ? { personaResponde: user.parentesco } : undefined,
        resetOptions: { keepDirtyValues: true }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: submitEvaluation,
        onError: (error: Error) => toast.error(error.message),
        onSuccess: (evaluacion) => {
            toast.success('Evaluación guardada');
            queryClient.invalidateQueries({ queryKey: ['kidHistory', id] });
            queryClient.invalidateQueries({ queryKey: ['recientes'] });
            navigate(`/dashboard/kid/${id}/evaluacion/${evaluacion?.id}`);
        }
    });

    if (isLoading) return <EvaluateKidSkeleton />;
    if (isError || !data?.testsDisponibles?.length) {
        return (
            <div className="tarjeta space-y-4 text-center">
                <p className="text-tinta-suave">No hay un cuestionario disponible para la edad de este niño o niña. FonoAlerta evalúa de 0 a 7 años.</p>
                <Link to={`/dashboard/kid/${id}`} className="boton-secundario">Volver al perfil</Link>
            </div>
        );
    }

    const test = data.testsDisponibles[0];

    const enviar = (form: Formulario) => {
        mutate({
            kidId: id!,
            testId: String(test.id),
            personaResponde: form.personaResponde,
            tiempoPantallas: form.tiempoPantallas,
            respuestas: test.preguntas.map(p => ({ idPregunta: p.id, respuesta: form[`q${p.id}`] }))
        });
    };

    const requerido = { required: 'Selecciona una opción' };

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <Link to={`/dashboard/kid/${id}`} className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Volver al perfil
            </Link>

            <header>
                <h1 className="titulo-pagina">{test.name}</h1>
                <p className="mt-2 text-tinta-suave">Responde pensando en cómo es {data.niño} en su día a día. Todas las preguntas son obligatorias.</p>
            </header>

            <form onSubmit={handleSubmit(enviar)} className="space-y-6" noValidate>
                <fieldset className="tarjeta space-y-6">
                    <legend className="sr-only">Datos de la evaluación</legend>
                    <div>
                        <p className="etiqueta">Edad del niño o niña</p>
                        <p className="mt-1 inline-block rounded-full bg-lavanda px-4 py-2 font-bold text-brand-700">{data.edadTexto}</p>
                    </div>

                    <div>
                        <label htmlFor="personaResponde" className="etiqueta">Persona que responde</label>
                        <select id="personaResponde" className="campo mt-2" {...register('personaResponde', { required: 'Indica quién responde' })}>
                            <option value="" disabled>Selecciona</option>
                            {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        {errors.personaResponde && <ErrorMessage>{errors.personaResponde.message}</ErrorMessage>}
                    </div>

                    <div role="radiogroup" aria-labelledby="tiempo-label">
                        <p id="tiempo-label" className="etiqueta mb-3">Tiempo promedio diario de exposición a pantallas</p>
                        <Opciones nombre="tiempoPantallas" opciones={TIEMPOS} registro={register('tiempoPantallas', requerido)} />
                        {errors.tiempoPantallas && <ErrorMessage>{errors.tiempoPantallas.message}</ErrorMessage>}
                    </div>
                </fieldset>

                <ol className="space-y-4">
                    {test.preguntas.map((pregunta, i) => (
                        <li key={pregunta.id} className="tarjeta" role="radiogroup" aria-labelledby={`p${pregunta.id}`}>
                            <p id={`p${pregunta.id}`} className="mb-4 text-lg font-bold">
                                <span className="mr-2 text-brand-500">{i + 1}.</span>{pregunta.pregunta}
                            </p>
                            <Opciones
                                nombre={`q${pregunta.id}`}
                                opciones={pregunta.opciones.map(o => o.respuesta)}
                                registro={register(`q${pregunta.id}`, requerido)}
                            />
                            {errors[`q${pregunta.id}`] && <ErrorMessage>{errors[`q${pregunta.id}`]?.message?.toString()}</ErrorMessage>}
                        </li>
                    ))}
                </ol>

                <AvisoOrientativo />

                <button type="submit" disabled={isPending} className="boton w-full py-4 text-lg">
                    {isPending ? 'Guardando…' : 'Ver resultado'}
                </button>
            </form>
        </div>
    );
}
