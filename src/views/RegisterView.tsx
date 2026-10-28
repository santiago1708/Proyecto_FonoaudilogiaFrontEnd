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
            toast.success('Cuenta creada. Revisa tu correo y escribe el código de confirmación.');
            navigate('/api/auth/confirm-email');
        }
    });

    const handleRegister = (data: RegisterForm) => mutate(data);

    const campos = [
        { id: 'name', etiqueta: 'Nombre completo', tipo: 'text', placeholder: 'Tu nombre', auto: 'name' },
        { id: 'email', etiqueta: 'Correo electrónico', tipo: 'email', placeholder: 'ejemplo@correo.com', auto: 'email' },
        { id: 'password', etiqueta: 'Contraseña', tipo: 'password', placeholder: 'Mínimo 8 caracteres', auto: 'new-password' },
        { id: 'password_confirmation', etiqueta: 'Confirmar contraseña', tipo: 'password', placeholder: 'Repite tu contraseña', auto: 'new-password' }
    ] as const;

    return (
        <>
            <h1 className="font-mano text-4xl">Crear cuenta</h1>
            <p className="mt-1 text-tinta-suave">Regístrate para evaluar y acompañar el desarrollo del lenguaje.</p>

            <form onSubmit={handleSubmit(handleRegister)} className="mt-6 space-y-4" noValidate>
                <div className="flex flex-col gap-2">
                    <label htmlFor="parentesco" className="etiqueta">¿Quién eres?</label>
                    <select id="parentesco" className="campo" {...register('parentesco')} defaultValue="">
                        <option value="" disabled>Selecciona una opción</option>
                        <option value="Madre">Madre</option>
                        <option value="Padre">Padre</option>
                        <option value="Cuidador">Cuidador(a)</option>
                        <option value="Profesional">Profesional (fonoaudiólogo u otro)</option>
                    </select>
                    {errors.parentesco && <ErrorMessage>{errors.parentesco.message}</ErrorMessage>}
                </div>

                {campos.map(c => (
                    <div key={c.id} className="flex flex-col gap-2">
                        <label htmlFor={c.id} className="etiqueta">{c.etiqueta}</label>
                        <input id={c.id} type={c.tipo} autoComplete={c.auto} placeholder={c.placeholder} className="campo" {...register(c.id)} />
                        {errors[c.id] && <ErrorMessage>{errors[c.id]?.message}</ErrorMessage>}
                    </div>
                ))}

                <div>
                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-lavanda p-4">
                        <input type="checkbox" className="mt-1 h-5 w-5 accent-brand-600" {...register('aceptaPrivacidad')} />
                        <span className="text-sm text-tinta-suave">
                            He leído y acepto la{' '}
                            <Link to="/politica-privacidad" target="_blank" className="font-bold text-brand-700 underline">política de privacidad</Link>
                            {' '}y autorizo el tratamiento de los datos que registre.
                        </span>
                    </label>
                    {errors.aceptaPrivacidad && <ErrorMessage>{errors.aceptaPrivacidad.message}</ErrorMessage>}
                </div>

                <button type="submit" disabled={isPending} className="boton w-full">
                    {isPending ? 'Creando cuenta…' : 'Crear cuenta'}
                </button>
            </form>

            <nav className="mt-6 text-center text-tinta-suave">
                <Link to="/login" className="hover:text-brand-700">¿Ya tienes cuenta? <span className="font-bold text-brand-700">Inicia sesión</span></Link>
            </nav>
        </>
    );
}
