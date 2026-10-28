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
            <h1 className="font-mano text-4xl">Iniciar sesión</h1>
            <p className="mt-1 text-tinta-suave">Ingresa con el correo con el que te registraste.</p>

            <form onSubmit={handleSubmit(handleLogin)} className="mt-6 space-y-5" noValidate>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="etiqueta">Correo electrónico</label>
                    <input id="email" type="email" autoComplete="email" placeholder="ejemplo@correo.com" className="campo" {...register('email')} />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="etiqueta">Contraseña</label>
                    <input id="password" type="password" autoComplete="current-password" placeholder="Tu contraseña" className="campo" {...register('password')} />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <button type="submit" disabled={isPending} className="boton w-full">
                    {isPending ? 'Ingresando…' : 'Iniciar sesión'}
                </button>
            </form>

            <nav className="mt-6 space-y-2 text-center text-tinta-suave">
                <Link to="/register" className="block hover:text-brand-700">¿No tienes cuenta? <span className="font-bold text-brand-700">Crea una aquí</span></Link>
                <Link to="/auth/forgot-password" className="block text-sm hover:text-brand-700">¿Olvidaste tu contraseña?</Link>
            </nav>
        </>
    );
}
