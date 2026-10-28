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
                <Link to="/dashboard" className="text-brand-600 hover:underline font-semibold">
                    &larr; Volver al Dashboard
                </Link>
                <h1 className="titulo-pagina mt-4">Registrar niño o niña</h1>
                <p className="text-tinta-suave mt-1">Ingresa los datos del niño para comenzar a evaluar</p>
            </div>

            <div className="bg-white shadow-sm border border-brand-100 rounded-2xl p-8">
                <form onSubmit={handleSubmit(handleRegisterKid)} className="space-y-6">
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-tinta">Nombre Completo</label>
                        <input
                            type="text"
                            placeholder="Nombre del niño o niña"
                            className="p-3 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                            {...register('name')}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-tinta">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="p-3 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                                {...register('fechaNacimiento')}
                            />
                            {errors.fechaNacimiento && <ErrorMessage>{errors.fechaNacimiento.message}</ErrorMessage>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-tinta">Genero</label>
                            <select
                                className="p-3 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
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
                        <label className="font-bold text-tinta">¿Se encuentra escolarizado?</label>
                        <select
                            className="p-3 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                            {...register('escolarizacion')}
                            defaultValue=""
                        >
                            <option value="" disabled>-- Seleccionar --</option>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                        {errors.escolarizacion && <ErrorMessage>{errors.escolarizacion.message}</ErrorMessage>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-tinta">Observaciones (Opcional)</label>
                        <textarea
                            placeholder="Algún detalle médico, conductual o antecedente relevante..."
                            className="p-3 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 h-24 resize-none"
                            {...register('observaciones')}
                        />
                    </div>

                    <input
                        type="submit"
                        value={isPending ? 'Guardando...' : 'Registrar Perfil'}
                        disabled={isPending}
                        className="bg-brand-600 hover:bg-brand-700 text-white w-full p-3 rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50"
                    />
                </form>
            </div>
        </div>
    );
}