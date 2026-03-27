import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { forgotPassword } from "../api/AuthAPI";
import { ForgotPasswordSchema, type ForgotPasswordForm } from "../types";
import ErrorMessage from "../components/ErrorMessages";

export default function ForgotPasswordView() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(ForgotPasswordSchema)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: forgotPassword,
        onError: (error: Error) => toast.error(error.message),
        onSuccess: () => {
            toast.success("Te hemos enviado un correo con las instrucciones.");
            navigate("/auth/reset-password"); // Lo mandamos a ingresar el código
        }
    });

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border w-full max-w-md mx-auto">
            <h1 className="text-3xl font-black text-gray-800 text-center mb-2">Recuperar Cuenta</h1>
            <p className="text-gray-500 text-center mb-8">Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.</p>

            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-6" noValidate>
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-gray-600 uppercase">Email Registrado</label>
                    <input
                        type="email"
                        placeholder="tu@email.com"
                        className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        {...register("email")}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    value={isPending ? "Enviando instrucciones..." : "Enviar Código"}
                    disabled={isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50"
                />
            </form>

            <nav className="mt-8 text-center">
                <Link to="/login" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                    ¿Ya la recordaste? Iniciar Sesión
                </Link>
            </nav>
        </div>
    );
}