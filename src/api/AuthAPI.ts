import { isAxiosError } from "axios";
import api from "../config/axios";
import type { ConfirmToken, LoginForm, RegisterForm } from "../types";

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