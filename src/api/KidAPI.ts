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

export async function getKidById(id: string) {
    try {
        const { data } = await api.get(`/Kid/get-kid/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || 'Error al obtener el perfil');
        }
        throw new Error('Hubo un error en el servidor');
    }
}

export async function getKidHistory(id: string) {
    try {
        // Asegúrate de que esta URL coincida con la ruta de tu backend para el historial
        const { data } = await api.get(`/evaluacion/history/kid/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || 'Error al obtener el historial');
        }
        throw new Error('Hubo un error en el servidor');
    }
}

export type RespuestaItem = {
    idPregunta: number;
    respuestaSeleccionada: string;
    puntaje: number;
};

export type EvaluationPayload = {
    kidId: string;
    testId: string;
    respuestas: RespuestaItem[];
};

export async function submitEvaluation({ kidId, testId, respuestas }: EvaluationPayload) {
    try {
        // Hacemos el POST a tu ruta exacta
        const { data } = await api.post(`/evaluacion/kid/${kidId}/test/${testId}`, { respuestas });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || 'Error al guardar la evaluación');
        }
        throw new Error('Hubo un error en el servidor');
    }
}

export async function getTestsForKid(id: string) {
    const { data } = await api.get(`/test/get-tests/kid/${id}`); // Ajusta a tu ruta real
    return data;
}

type updateKidParams = {
    name: string;
    fechaNacimiento: string;
    genero: string;
    escolarizacion: boolean;
    observaciones?: string;
}

export async function updateKid({ id, formData }: { id: number, formData: updateKidParams }) {
    try {
        const { data } = await api.put(`/kid/update-kid/${id}`, formData); // Ajusta la ruta según tu backend
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al actualizar el paciente');
    }
}

// Eliminar un paciente
export async function deleteKid(id: string) {
    try {
        const { data } = await api.delete(`/kid/delete-kid/${id}`); // Ajusta la ruta según tu backend
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al eliminar el paciente');
    }
}