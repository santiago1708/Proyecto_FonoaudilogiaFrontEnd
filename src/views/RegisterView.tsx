import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RegisterSchema, type RegisterForm } from '../types';
import { registerUser } from '../api/AuthAPI';
import ErrorMessage from '../components/ErrorMessages'; // Ojo: asegúrate que coincida con el nombre de tu componente

export default function RegisterView() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(RegisterSchema)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: registerUser,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Cuenta creada correctamente. Por favor, inicia sesión.');
            navigate('/login'); // Lo mandamos a loguearse después de registrarse
        }
    });

    const handleRegister = (data: RegisterForm) => mutate(data);

    return (
        <>
            <h1 className="text-3xl font-black text-center text-gray-800">Crear Cuenta</h1>
            <p className="text-center text-gray-500 mt-2 mb-8">Únete para gestionar las evaluaciones</p>

            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700">Nombre Completo</label>
                    <input
                        type="text"
                        placeholder="Tu nombre"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('name')}
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700">Email</label>
                    <input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('email')}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('password')}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700">Confirmar Contraseña</label>
                    <input
                        type="password"
                        placeholder="Repite tu contraseña"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('password_confirmation')}
                    />
                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700">Parentesco / Rol</label>
                    <select
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        {...register('parentesco')}
                        defaultValue=""
                    >
                        <option value="" disabled>-- Selecciona un rol --</option>
                        <option value="Madre">Madre</option>
                        <option value="Padre">Padre</option>
                        <option value="Cuidador">Cuidador</option>
                        <option value="Profesional">Profesional</option>
                    </select>
                    {errors.parentesco && <ErrorMessage>{errors.parentesco.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    value={isPending ? 'Registrando...' : 'Crear Cuenta'}
                    disabled={isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg font-bold cursor-pointer transition-colors disabled:opacity-50 mt-4"
                />
            </form>

            <nav className="mt-8 text-center">
                <Link to="/login" className="text-gray-500 hover:text-blue-600">
                    ¿Ya tienes cuenta? Inicia Sesión
                </Link>
            </nav>
        </>
    );
}