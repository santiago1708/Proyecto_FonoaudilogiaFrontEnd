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


export const KidRegistrationSchema = z.object({
    name: z.string().min(2, 'El nombre es obligatorio'),
    fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
    genero: z.enum(['Masculino', 'Femenino'], 'Selecciona un sexo válido'),
    // Lo dejamos como string para que React Hook Form no se pelee con el <select>
    escolarizacion: z.string().min(1, 'Selecciona una opción'),
    observaciones: z.string().optional()
});

export type KidRegistrationForm = z.infer<typeof KidRegistrationSchema>;


export type Kid = {
    id: number; // o string, dependiendo de cómo lo tengas en tu base de datos
    name: string;
    fechaNacimiento: string;
    genero: string;
    escolarizacion: boolean;
    observaciones?: string;
    edadCalculada?: string; // Este es el campo virtual que creaste en tu backend genial
};