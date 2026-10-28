import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ConfirmTokenSchema, type ConfirmToken } from '../types';
import { confirmAccount } from '../api/AuthAPI';
import ErrorMessage from '../components/ErrorMessages';

export default function ConfirmAccountView() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<ConfirmToken>({
        resolver: zodResolver(ConfirmTokenSchema)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('¡Cuenta confirmada correctamente! Ya puedes iniciar sesión.');
            navigate('/login'); // Lo enviamos a loguearse
        }
    });

    const handleConfirm = (data: ConfirmToken) => mutate(data);

    return (
        <>
            <h1 className="font-mano text-4xl">Confirma tu cuenta</h1>
            <p className="text-center text-tinta-suave mt-2 mb-8">
                Ingresa el código de 6 dígitos que enviamos a tu correo electrónico.
            </p>

            <form onSubmit={handleSubmit(handleConfirm)} className="space-y-6">
                <div className="flex flex-col gap-2 items-center">
                    <label className="font-bold text-tinta">Código de Verificación</label>
                    <input
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        className="p-4 text-center text-3xl tracking-widest font-bold border border-brand-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500 w-full "
                        {...register('token')}
                    />
                    {errors.token && <ErrorMessage>{errors.token.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    value={isPending ? 'Verificando...' : 'Confirmar Cuenta'}
                    disabled={isPending}
                    className="bg-brand-600 hover:bg-brand-700 text-white w-full p-3 rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50"
                />
            </form>

            <nav className="mt-8 text-center">
                <Link to="/login" className="text-tinta-suave hover:text-brand-600">
                    ¿Ya confirmaste? Inicia Sesión
                </Link>
            </nav>
        </>
    );
}