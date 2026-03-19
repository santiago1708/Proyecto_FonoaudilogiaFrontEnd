import { isAxiosError } from "axios";
import api from "../config/axios";
import type { LoginForm } from "../types";

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