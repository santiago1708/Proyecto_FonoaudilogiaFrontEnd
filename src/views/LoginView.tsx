import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginUser } from '../api/AuthAPI';
import ErrorMessage from '../components/ErrorMessages';
import { LoginSchema, type LoginForm } from '../types';

export default function LoginView() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(LoginSchema)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (token) => {
            localStorage.setItem('AUTH_TOKEN', token);
            toast.success('Inicio de sesión exitoso');
            navigate('/dashboard'); // Redirigir al layout privado
        }
    });

    const handleLogin = (data: LoginForm) => mutate(data);

    return (
        <>
            <h1 className="text-3xl font-black text-center text-gray-800">Iniciar Sesión</h1>
            <p className="text-center text-gray-500 mt-2 mb-8">Administra las evaluaciones de fonoaudiología</p>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
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
                        placeholder="Tu contraseña"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('password')}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    value={isPending ? 'Cargando...' : 'Iniciar Sesión'}
                    disabled={isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg font-bold cursor-pointer transition-colors disabled:opacity-50"
                />
            </form>

            <nav className="mt-8 text-center">
                <Link to="/register" className="text-gray-500 hover:text-blue-600">
                    ¿No tienes cuenta? Crea una aquí
                </Link>
            </nav>
        </>
    );
}