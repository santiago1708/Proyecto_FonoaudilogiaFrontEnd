import { isAxiosError } from "axios";
import api from "../config/axios";
import type { Contacto, Evaluacion, EvaluacionConRecomendaciones, KidRegistrationForm, TestHistory } from "../types";

// Convierte el error de axios en un mensaje legible para el usuario
export function mensajeDeError(error: unknown, porDefecto: string): never {
    if (isAxiosError(error) && error.response) {
        const data = error.response.data;
        if (data?.errors?.length) throw new Error(data.errors[0].msg);
        if (data?.error) throw new Error(data.error);
        if (data?.message) throw new Error(data.message);
    }
    throw new Error(porDefecto);
}

export async function registerKid(formData: KidRegistrationForm) {
    try {
        // El <select> entrega "true"/"false"; el backend espera un booleano
        const payload = {
            ...formData,
            escolarizacion: formData.escolarizacion === 'true'
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
        const { data } = await api.get(`/kid/get-kid/${id}`);
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
    respuesta: string;
};

export type EvaluationPayload = {
    kidId: string;
    testId: string;
    personaResponde: string;
    tiempoPantallas: string;
    respuestas: RespuestaItem[];
};

export async function submitEvaluation({ kidId, testId, ...body }: EvaluationPayload) {
    try {
        const { data } = await api.post<{ evaluacion: Evaluacion }>(`/evaluacion/kid/${kidId}/test/${testId}`, body);
        return data.evaluacion;
    } catch (error) {
        mensajeDeError(error, 'Error al guardar la evaluación');
    }
}

export async function getEvaluation(kidId: string, evaluacionId: string) {
    try {
        const { data } = await api.get<{ niño: { id: number; name: string }; evaluacion: Evaluacion }>(`/evaluacion/kid/${kidId}/${evaluacionId}`);
        return data;
    } catch (error) {
        mensajeDeError(error, 'Error al obtener la evaluación');
    }
}

export async function getRecentEvaluations() {
    try {
        const { data } = await api.get<TestHistory[]>('/evaluacion/recientes');
        return data;
    } catch (error) {
        mensajeDeError(error, 'Error al obtener los resultados');
    }
}

export async function getKidRecommendations(kidId: string) {
    try {
        const { data } = await api.get<{ niño: { id: number; name: string }; evaluaciones: EvaluacionConRecomendaciones[] }>(`/evaluacion/recomendaciones/kid/${kidId}`);
        return data;
    } catch (error) {
        mensajeDeError(error, 'Error al obtener las recomendaciones');
    }
}

export async function getContactos() {
    try {
        const { data } = await api.get<Contacto[]>('/contactos');
        return data;
    } catch (error) {
        mensajeDeError(error, 'Error al obtener los contactos');
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