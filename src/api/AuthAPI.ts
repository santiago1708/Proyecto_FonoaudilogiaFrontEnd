import { isAxiosError } from "axios";
import api from "../config/axios";
import type { ConfirmToken, ForgotPasswordForm, LoginForm, RegisterForm, ResetPasswordForm, UpdatePasswordForm } from "../types";

export async function loginUser(formData: LoginForm) {
    try {
        const { data } = await api.post('/auth/login', formData);
        return data; 
    } catch (error) {
        // Usamos isAxiosError en lugar de ": any"
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || 'Error al iniciar sesión');
        }
        throw new Error('Hubo un error en el servidor');
    }
}

export async function registerUser(formData: RegisterForm) {
    try {
        const { data } = await api.post('/auth/create-account', formData);
        return data; 
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            // 1. Si el backend devuelve un arreglo de errores de express-validator
            if (error.response.data.errors) {
                // Lanzamos el primer error de la lista para que Sonner lo muestre
                throw new Error(error.response.data.errors[0].msg);
            }
            // 2. Si el backend devuelve un error general (ej: "El correo ya existe" con status 409)
            if (error.response.data.error) {
                throw new Error(error.response.data.error);
            }
        }
        throw new Error('Hubo un error en el servidor');
    }
}


export async function confirmAccount(formData: ConfirmToken) {
    try {
        // Ajusta la URL si en tu backend la ruta se llama distinto (ej: /auth/verificar)
        const { data } = await api.post('/auth/confirm-email', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            if (error.response.data.errors) {
                throw new Error(error.response.data.errors[0].msg);
            }
            if (error.response.data.error) {
                throw new Error(error.response.data.error);
            }
        }
        throw new Error('Hubo un error en el servidor');
    }
}


export async function getUser() {
    try {
        const { data } = await api.get('/auth/profile');
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || 'Error al obtener el usuario');
        }
        throw new Error('Hubo un error en el servidor');
    }
}


export async function updatePassword(formData: UpdatePasswordForm) {
    try {
        const { data } = await api.post('/auth/change-password', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
    try {
        const { data } = await api.post('/auth/forgot-password', formData); // Ajusta la ruta
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al enviar el correo de recuperación');
    }
}

export async function resetPassword(formData: ResetPasswordForm) {
    try {
        // Extraemos el token y las contraseñas del formData
        const { token, password, confirmPassword } = formData;

        // Inyectamos el token directamente en la URL como espera tu backend
        const { data } = await api.post(`/auth/reset-password/${token}`, {
            password,
            confirmPassword
        }); 
        
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al restablecer la contraseña');
    }
}