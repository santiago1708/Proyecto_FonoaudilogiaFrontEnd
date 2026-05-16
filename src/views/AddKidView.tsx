import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { KidRegistrationSchema, type KidRegistrationForm } from '../types';
import ErrorMessage from '../components/ErrorMessages';
import { registerKid } from '../api/KidAPI';

export default function AddKidView() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<KidRegistrationForm>({
        resolver: zodResolver(KidRegistrationSchema)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: registerKid,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Perfil registrado correctamente');
            navigate('/dashboard'); // Lo regresamos al panel principal
        }
    });

    const handleRegisterKid = (data: KidRegistrationForm) => mutate(data);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <Link to="/dashboard" className="text-blue-600 hover:underline font-semibold">
                    &larr; Volver al Dashboard
                </Link>
                <h1 className="text-3xl font-black text-gray-800 mt-4">Registrar Nuevo Perfil</h1>
                <p className="text-gray-500 mt-1">Ingresa los datos del niño para comenzar a evaluar</p>
            </div>

            <div className="bg-white shadow-sm border rounded-2xl p-8">
                <form onSubmit={handleSubmit(handleRegisterKid)} className="space-y-6">

                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-gray-700">Nombre Completo</label>
                        <input
                            type="text"
                            placeholder="Nombre del niño/paciente"
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register('name')}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-gray-700">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register('fechaNacimiento')}
                            />
                            {errors.fechaNacimiento && <ErrorMessage>{errors.fechaNacimiento.message}</ErrorMessage>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-gray-700">Genero</label>
                            <select
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                {...register('genero')}
                                defaultValue=""
                            >
                                <option value="" disabled>-- Seleccionar --</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                            {errors.genero && <ErrorMessage>{errors.genero.message}</ErrorMessage>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-gray-700">¿Se encuentra escolarizado?</label>
                        <select
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            {...register('escolarizacion', {
                                setValueAs: v => v === 'true',
                            })}
                            defaultValue=""
                        >
                            <option value="" disabled>-- Seleccionar --</option>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                        {errors.escolarizacion && <ErrorMessage>{errors.escolarizacion.message}</ErrorMessage>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-gray-700">Observaciones (Opcional)</label>
                        <textarea
                            placeholder="Algún detalle médico, conductual o antecedente relevante..."
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                            {...register('observaciones')}
                        />
                    </div>

                    <input
                        type="submit"
                        value={isPending ? 'Guardando...' : 'Registrar Perfil'}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg font-bold cursor-pointer transition-colors disabled:opacity-50"
                    />
                </form>
            </div>
        </div>
    );
}