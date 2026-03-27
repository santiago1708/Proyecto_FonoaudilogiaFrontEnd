import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePassword, getUser } from "../api/AuthAPI"; 
import { UpdatePasswordSchema, type UpdatePasswordForm } from "../types";
import ErrorMessage from "../components/ErrorMessages";

export default function ProfileView() {
    // 1. Traemos los datos del usuario logueado desde el backend
    const { data: user, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getUser,
        retry: 1,
        refetchOnWindowFocus: false
    });

    // 2. Configuramos el formulario de contraseñas
    const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdatePasswordForm>({
        resolver: zodResolver(UpdatePasswordSchema)
    });

    // 3. Mutación para guardar la nueva contraseña
    const { mutate, isPending } = useMutation({
        mutationFn: updatePassword,
        onError: (error: Error) => toast.error(error.message),
        onSuccess: () => {
            toast.success("¡Contraseña actualizada correctamente!");
            reset(); 
        }
    });

    if (isLoading) return <p className="text-center py-20 font-bold text-gray-500">Cargando datos del perfil...</p>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-black text-gray-800">Mi Perfil</h1>
                <p className="text-xl font-light text-gray-500 mt-2">Consulta tu información y gestiona tu seguridad.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* --- SECCIÓN 1: DATOS DE SOLO LECTURA --- */}
                <div className="bg-white shadow-sm border rounded-2xl p-8 h-fit">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Datos de la Cuenta</h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="font-bold text-sm uppercase text-gray-600">Nombre</label>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-medium">
                                {/* Asegúrate de usar los nombres de variables correctos que te devuelve tu backend (ej. user.nombre) */}
                                {user?.name || "No disponible"} 
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-bold text-sm uppercase text-gray-600">Correo Electrónico</label>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-medium">
                                {user?.email || "No disponible"}
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 italic mt-4">
                            * La información personal no puede ser modificada por motivos de seguridad.
                        </p>
                    </div>
                </div>

                {/* --- SECCIÓN 2: FORMULARIO DE CONTRASEÑA --- */}
                <div className="bg-white shadow-sm border border-red-100 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-red-600">Cambiar Contraseña</h2>
                    
                    <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-6" noValidate>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm text-gray-600 uppercase">Contraseña Actual</label>
                            <input
                                type="password"
                                placeholder="Tu contraseña actual"
                                className="p-3 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                                {...register("currentPassword")}
                            />
                            {errors.currentPassword && <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm text-gray-600 uppercase">Nueva Contraseña</label>
                            <input
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                className="p-3 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                                {...register("newPassword")}
                            />
                            {errors.newPassword && <ErrorMessage>{errors.newPassword.message}</ErrorMessage>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm text-gray-600 uppercase">Confirmar Contraseña</label>
                            <input
                                type="password"
                                placeholder="Repite tu nueva contraseña"
                                className="p-3 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                                {...register("confirmNewPassword")}
                            />
                            {errors.confirmNewPassword && <ErrorMessage>{errors.confirmNewPassword.message}</ErrorMessage>}
                        </div>

                        <div className="pt-4 border-t border-gray-100 mt-6">
                            <input
                                type="submit"
                                value={isPending ? "Guardando..." : "Actualizar Contraseña"}
                                disabled={isPending}
                                className="bg-gray-800 hover:bg-black text-white w-full p-3 rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}