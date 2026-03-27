import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { getKidById, updateKid } from '../api/KidAPI';
import ErrorMessage from '../components/ErrorMessages';

// 1. Definimos el esquema de validación para la edición
const EditKidSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
    escolarizacion: z.boolean(),
    genero: z.string().min(1, 'El género es obligatorio'),
    observaciones: z.string().optional()
});

type EditKidFormType = z.infer<typeof EditKidSchema>;

export default function EditKidView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 2. Traemos los datos actuales del paciente para llenar el formulario
    const { data: kid, isLoading } = useQuery({
        queryKey: ['kid', id],
        queryFn: () => getKidById(id!),
        enabled: !!id
    });

    // 3. Configuramos el formulario
    const { register, handleSubmit, formState: { errors } } = useForm<EditKidFormType>({
        resolver: zodResolver(EditKidSchema),
        // RHF llenará los inputs automáticamente en cuanto 'kid' tenga datos
        values: kid ? {
            name: kid.name,
            // Ajustamos la fecha al formato YYYY-MM-DD que requieren los inputs de tipo date
            fechaNacimiento: new Date(kid.fechaNacimiento).toISOString().split('T')[0],
            escolarizacion: kid.escolarizacion,
            genero: kid.genero,
            observaciones: kid.observaciones
        } : undefined
    });

    // 4. Mutación para guardar los cambios
    const { mutate, isPending } = useMutation({
        mutationFn: updateKid,
        onError: (error: Error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('¡Paciente actualizado correctamente!');
            // Refrescamos los datos en caché para que el perfil muestre lo nuevo
            queryClient.invalidateQueries({ queryKey: ['kid', id] });
            queryClient.invalidateQueries({ queryKey: ['kids'] });
            navigate(`/dashboard/kid/${id}`); // Regresamos al perfil
        }
    });

    const handleEditKid = (formData: EditKidFormType) => {
        mutate({ id: +id!, formData });
    };

    if (isLoading) return <p className="text-center py-20 font-bold text-xl text-gray-500">Cargando datos del paciente...</p>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link to={`/dashboard/kid/${id}`} className="text-blue-600 hover:underline font-semibold block mb-4">
                &larr; Volver al Perfil
            </Link>

            <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h1 className="text-3xl font-black text-gray-800 mb-2">Editar Paciente</h1>
                <p className="text-gray-500 mb-8">Actualiza la información de <span className="font-bold text-blue-600">{kid?.nombre}</span>.</p>

                <form onSubmit={handleSubmit(handleEditKid)} className="space-y-6">
                    {/* Campo: Nombre */}
                    <div className="space-y-2">
                        <label className="font-bold text-sm uppercase text-gray-600">Nombre Completo</label>
                        <input
                            type="text"
                            placeholder="Ej. Juan Pérez"
                            className="w-full p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            {...register('name')}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </div>

                    {/* Campo: Fecha de Nacimiento */}
                    <div className="space-y-2">
                        <label className="font-bold text-sm uppercase text-gray-600">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            className="w-full p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            {...register('fechaNacimiento')}
                        />
                        {errors.fechaNacimiento && <ErrorMessage>{errors.fechaNacimiento.message}</ErrorMessage>}
                    </div>

                    <div className="space-y-2 flex flex-col gap-2">
                        <label className="font-bold text-gray-700">Genero</label>
                        <select
                            className="p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            {...register('genero')}
                            defaultValue=""
                        >
                            <option value="" disabled>-- Seleccionar --</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>
                    {/* Campo: Escolarizado (Checkbox o Select) */}
                    <div className="space-y-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
                        <input
                            type="checkbox"
                            id="escolarizacion"
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                            {...register('escolarizacion')}
                        />
                        <label htmlFor="escolarizacion" className="font-bold text-gray-700 cursor-pointer">
                            ¿El niño se encuentra escolarizado actualmente?
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-gray-700">Observaciones (Opcional)</label>
                        <textarea
                            placeholder="Algún detalle médico, conductual o antecedente relevante..."
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                            {...register('observaciones')}
                        />
                    </div>

                    {/* Botón Guardar */}
                    <div className="pt-6 border-t border-gray-100 mt-8">
                        <input
                            type="submit"
                            value={isPending ? 'Guardando cambios...' : 'Guardar Cambios'}
                            disabled={isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-4 rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50 text-lg shadow-md"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}