import { z } from 'zod';

// === AUTH ===
export const LoginSchema = z.object({
    email: z.string().email('El correo no es válido'),
    password: z.string().min(1, 'La contraseña es obligatoria')
});

export type LoginForm = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    name: z.string().min(2, 'El nombre es muy corto'),
    email: z.string().email('El correo no es válido'),
    password: z.string().min(8, 'La contraseña debe tener mínimo 8 caracteres'),
    password_confirmation: z.string(),
    parentesco: z.enum(['Madre', 'Padre', 'Cuidador', 'Profesional'])
}).refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"]
});

export type RegisterForm = z.infer<typeof RegisterSchema>;