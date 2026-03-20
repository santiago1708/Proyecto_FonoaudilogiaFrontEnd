import { isAxiosError } from "axios";
import api from "../config/axios";
import type { KidRegistrationForm } from "../types";

export async function registerKid(formData: KidRegistrationForm) {
    try {
        // Transformamos el string ("true"/"false") a un booleano real (true/false)
        const payload = {
            ...formData,
            escolarizado: formData.escolarizacion === 'true'
        };

        // Enviamos el payload corregido al backend
        const { data } = await api.post('/kid/add-kid', payload);
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
        throw new Error('Hubo un error al registrar el perfil');
    }
}


export async function getKids() {
    try {
        // Hacemos un GET a la ruta de niños (Asegúrate de que esta sea la ruta correcta de tu backend)
        const { data } = await api.get('/kid/get-kids');
        return data; 
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || 'Error al obtener los pacientes');
        }
        throw new Error('Hubo un error en el servidor');
    }
}