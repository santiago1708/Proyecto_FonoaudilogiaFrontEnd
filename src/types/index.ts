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
    parentesco: z.enum(['Madre', 'Padre', 'Cuidador', 'Profesional'], 'Selecciona un parentesco válido')
}).refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"]
});

export type RegisterForm = z.infer<typeof RegisterSchema>;

export const ConfirmTokenSchema = z.object({
    token: z.string().length(6, { message: 'El código debe tener exactamente 6 dígitos' })
});

export type ConfirmToken = z.infer<typeof ConfirmTokenSchema>;