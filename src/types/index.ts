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
    parentesco: z.enum(['Madre', 'Padre', 'Cuidador', 'Profesional'], 'Selecciona quién eres'),
    aceptaPrivacidad: z.literal(true, 'Debes aceptar la política de privacidad para crear la cuenta')
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
    id: number;
    name: string;
    fechaNacimiento: string;
    genero: string;
    escolarizacion: boolean;
    observaciones?: string;
    edadCalculada?: string;
    edadEnMeses?: number;
};

export type Nivel = 'esperado' | 'leve' | 'alto';
export type Perfil = 'familia' | 'profesional';

export type TestHistory = {
    id: number;
    kidId?: number;
    puntaje: number;
    clasificacion: string;
    nivel?: Nivel | null;
    fechaRealizacion: string;
    edadTexto?: string | null;
    personaResponde?: string | null;
    tiempoPantallas?: string | null;
    progreso?: string | null;
    createdAt: string;
    test?: { name: string; rango?: string | null };
    kid?: { id: number; name: string };
};

export type RespuestaDetalle = {
    idPregunta: number;
    pregunta: string;
    respuesta: string;
    puntaje: number;
};

export type ActividadFamilia = {
    nombre: string;
    objetivo: string;
    pasos: string[];
    materiales: string;
    recomendacion: string;
};

export type ActividadProfesional = {
    nombre: string;
    objetivo: string;
    procedimiento: string[];
    aspectos: string;
    orientacionFamiliar?: string;
    orientacionProfesional?: string;
    precaucion?: string;
};

export type RecomendacionPorRespuesta = RespuestaDetalle & { recomendacion: string };

export type BloqueRecomendaciones = {
    perfil: Perfil;
    nivel: Nivel;
    mensaje: string;
    porRespuesta?: RecomendacionPorRespuesta[];
    aviso: string;
    objetivo?: string;
    recomendaciones?: string[];
    actividadesFamilia?: ActividadFamilia[];
    introduccion?: string;
    actividadesProfesional?: ActividadProfesional[];
};

export type Evaluacion = TestHistory & {
    mensaje: string;
    respuestas: RespuestaDetalle[];
    indicadores: RespuestaDetalle[];
    perfilUsuario: Perfil;
    mensajeProgreso: string;
    recomendaciones: BloqueRecomendaciones;
};

// === Administración ===
export type OpcionAdmin = { respuesta: string; puntaje: number };
export type PreguntaAdmin = { id: number; pregunta: string; opciones: OpcionAdmin[]; recomendacion?: string };
export type TestAdmin = {
    id: number;
    clave: string | null;
    name: string;
    rango: string | null;
    minMeses: number;
    maxMeses: number;
    activo: boolean;
    preguntas: PreguntaAdmin[];
    evaluaciones: number;
};
export type RecomendacionNivelAdmin = { id: number; nivel: Nivel; perfil: Perfil; objetivo: string | null; items: string[] };
export type ActividadAdmin = {
    id: number;
    clave: string;
    perfil: Perfil;
    nombre: string;
    objetivo: string;
    pasos: string[];
    materiales?: string | null;
    recomendacion?: string | null;
    aspectos?: string | null;
    orientacionFamiliar?: string | null;
    orientacionProfesional?: string | null;
    precaucion?: string | null;
    orden: number;
};
export type Contacto = { id: number; nombre: string; telefono: string; descripcion?: string | null; activo?: boolean };
export type Administrador = { id: number; name: string; email: string };

export type EvaluacionConRecomendaciones = TestHistory & { recomendaciones: BloqueRecomendaciones | null };

export const UserSchema = z.object({
    id: z.number().or(z.string()),
    name: z.string(),
    email: z.string(),
    parentesco: z.string(),
    rol: z.enum(['usuario', 'admin']).optional()
});

export type User = z.infer<typeof UserSchema>;


export const EvaluationFormSchema = z.object({
    q1: z.string({ message: 'Selecciona una opción' }),
    q2: z.string({ message: 'Selecciona una opción' }),
    q3: z.string({ message: 'Selecciona una opción' }),
    q4: z.string({ message: 'Selecciona una opción' }),
    q5: z.string({ message: 'Selecciona una opción' }),
    q6: z.string({ message: 'Selecciona una opción' }),
    q7: z.string({ message: 'Selecciona una opción' }),
    q8: z.string({ message: 'Selecciona una opción' }),
    q9: z.string({ message: 'Selecciona una opción' }),
    q10: z.string({ message: 'Selecciona una opción' }),
});

export type EvaluationForm = z.infer<typeof EvaluationFormSchema>;


export const UpdatePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
});

export type UpdatePasswordForm = z.infer<typeof UpdatePasswordSchema>;

export const ForgotPasswordSchema = z.object({
    email: z.string().email('El formato del correo no es válido'),
});
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
    token: z.string().min(6, 'El código/token debe tener al menos 6 caracteres'),
    password: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
