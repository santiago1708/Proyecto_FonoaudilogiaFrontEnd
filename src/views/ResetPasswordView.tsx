import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "../api/AuthAPI";
import { ResetPasswordSchema, type ResetPasswordForm } from "../types";
import ErrorMessage from "../components/ErrorMessages";

export default function ResetPasswordView() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
        resolver: zodResolver(ResetPasswordSchema)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: resetPassword,
        onError: (error: Error) => toast.error(error.message),
        onSuccess: () => {
            toast.success("¡Contraseña restablecida correctamente!");
            navigate("/login"); // Lo mandamos a iniciar sesión con su nueva clave
        }
    });

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border w-full max-w-md mx-auto">
            <h1 className="text-3xl font-black text-gray-800 text-center mb-2">Crear Nueva Contraseña</h1>
            <p className="text-gray-500 text-center mb-8">Ingresa el código que recibiste por correo y tu nueva contraseña.</p>

            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-6" noValidate>
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-gray-600 uppercase">Código de Seguridad</label>
                    <input
                        type="text"
                        placeholder="Ej. 123456 o ABCDEF"
                        className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-center text-lg tracking-widest font-mono uppercase"
                        {...register("token")}
                    />
                    {errors.token && <ErrorMessage>{errors.token.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-gray-600 uppercase">Nueva Contraseña</label>
                    <input
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        {...register("password")}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-gray-600 uppercase">Confirmar Contraseña</label>
                    <input
                        type="password"
                        placeholder="Repite tu nueva contraseña"
                        className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    value={isPending ? "Restableciendo..." : "Guardar Contraseña"}
                    disabled={isPending}
                    className="bg-gray-800 hover:bg-black text-white w-full p-3 rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50"
                />
            </form>
        </div>
    );
}