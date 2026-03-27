import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getTestsForKid, submitEvaluation } from '../api/KidAPI';
import ErrorMessage from '../components/ErrorMessages';
import EvaluateKidSkeleton from '../components/EvaluateKidSkeleton';

// --- DEFINICIÓN DE TIPOS PARA TS ---
interface Opcion {
    respuesta: string;
    puntaje: number;
}

interface Pregunta {
    id: number;
    pregunta: string;
    opciones: Opcion[];
}

interface TestDisponible {
    id: number;
    name: string;
    preguntas: Pregunta[];
}

interface TestsResponse {
    niño: string;
    edadMeses: number;
    testsDisponibles: TestDisponible[];
}

export default function EvaluateKidView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 1. Obtener el test adecuado (Tipamos el useQuery)
    const { data, isLoading, isError } = useQuery<TestsResponse>({
        queryKey: ['availableTest', id],
        queryFn: () => getTestsForKid(id!),
        retry: false,
        enabled: !!id
    });

    // Tipamos el formulario como un objeto de strings (q1: "Sí", q2: "No"...)
    const { register, handleSubmit, formState: { errors } } = useForm<Record<string, string>>();

    const { mutate, isPending } = useMutation({
        mutationFn: submitEvaluation,
        onError: (error: Error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('¡Evaluación registrada correctamente!');
            queryClient.invalidateQueries({ queryKey: ['kidHistory', id] });
            navigate(`/dashboard/kid/${id}`);
        }
    });

    if (isLoading) return <EvaluateKidSkeleton />;
    if (isError || !data?.testsDisponibles?.length) return <p className="text-center py-20 text-red-500">No se encontraron tests disponibles para la edad del niño.</p>;

    const activeTest = data.testsDisponibles[0];

    const handleEvaluate = (formData: Record<string, string>) => {
        // 2. Construir el JSON exacto basado en la respuesta seleccionada
        const respuestas = activeTest.preguntas.map((pregunta) => {
            const respuestaSeleccionada = formData[`q${pregunta.id}`];
            // Buscamos el puntaje real dentro de las opciones de la pregunta
            const opcionMarcada = pregunta.opciones.find(o => o.respuesta === respuestaSeleccionada);
            
            return {
                idPregunta: pregunta.id,
                respuestaSeleccionada,
                puntaje: opcionMarcada ? opcionMarcada.puntaje : 0
            };
        });

        mutate({ 
            kidId: id!, 
            testId: activeTest.id.toString(), 
            respuestas 
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to={`/dashboard/kid/${id}`} className="text-blue-600 hover:underline font-semibold block mb-4">
                &larr; Cancelar y Volver al Perfil
            </Link>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h1 className="text-3xl font-black text-gray-800 mb-2">{activeTest.name}</h1>
                <p className="text-gray-500 mb-8 font-medium">Evaluación para: <span className="text-blue-600">{data.niño}</span> ({data.edadMeses} meses).</p>

                <form onSubmit={handleSubmit(handleEvaluate)} className="space-y-8">
                    {activeTest.preguntas.map((pregunta) => (
                        <div key={pregunta.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <p className="font-bold text-gray-800 mb-4">{pregunta.pregunta}</p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                {pregunta.opciones.map((opcion) => (
                                    <label 
                                        key={opcion.respuesta} 
                                        className={`flex-1 flex items-center gap-2 p-4 bg-white border rounded-lg cursor-pointer transition-colors shadow-sm ${
                                            opcion.respuesta === 'Sí' ? 'hover:border-green-500 hover:bg-green-50' : 'hover:border-red-500 hover:bg-red-50'
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            value={opcion.respuesta} 
                                            {...register(`q${pregunta.id}`, { required: 'Debes seleccionar una respuesta' })} 
                                            className="w-5 h-5 text-blue-600 focus:ring-blue-500" 
                                        />
                                        <span className="font-semibold text-gray-700">{opcion.respuesta}</span>
                                    </label>
                                ))}
                            </div>
                            {errors[`q${pregunta.id}`] && (
                                <ErrorMessage>{errors[`q${pregunta.id}`]?.message?.toString()}</ErrorMessage>
                            )}
                        </div>
                    ))}

                    <div className="pt-6 border-t mt-8">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-4 rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50 text-lg shadow-md"
                        >
                            {isPending ? 'Enviando Evaluación...' : 'Finalizar y Guardar Resultados'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}