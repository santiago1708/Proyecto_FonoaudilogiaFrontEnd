import api from '../config/axios';
import { mensajeDeError } from './KidAPI';
import type { ActividadAdmin, Administrador, Contacto, RecomendacionNivelAdmin, TestAdmin } from '../types';

const llamar = async <T,>(promesa: Promise<{ data: T }>, porDefecto: string): Promise<T> => {
    try {
        return (await promesa).data;
    } catch (error) {
        mensajeDeError(error, porDefecto);
    }
};

export const getTestsAdmin = () => llamar(api.get<TestAdmin[]>('/admin/tests'), 'Error al obtener los cuestionarios');
export const updateTestAdmin = (test: TestAdmin) => llamar(api.put<TestAdmin>(`/admin/tests/${test.id}`, test), 'Error al guardar el cuestionario');

export const getRecomendacionesAdmin = () => llamar(api.get<RecomendacionNivelAdmin[]>('/admin/recomendaciones'), 'Error al obtener las recomendaciones');
export const updateRecomendacionAdmin = (r: RecomendacionNivelAdmin) => llamar(api.put(`/admin/recomendaciones/${r.id}`, r), 'Error al guardar la recomendación');

export const getActividadesAdmin = () => llamar(api.get<ActividadAdmin[]>('/admin/actividades'), 'Error al obtener las actividades');
export const saveActividadAdmin = (a: Omit<ActividadAdmin, 'id'> & { id?: number }) => a.id
    ? llamar(api.put(`/admin/actividades/${a.id}`, a), 'Error al guardar la actividad')
    : llamar(api.post('/admin/actividades', a), 'Error al crear la actividad');
export const deleteActividadAdmin = (id: number) => llamar(api.delete(`/admin/actividades/${id}`), 'Error al eliminar la actividad');

export const getContactosAdmin = () => llamar(api.get<Contacto[]>('/admin/contactos'), 'Error al obtener los contactos');
export const saveContactoAdmin = (c: Omit<Contacto, 'id'> & { id?: number }) => c.id
    ? llamar(api.put(`/admin/contactos/${c.id}`, c), 'Error al guardar el contacto')
    : llamar(api.post('/admin/contactos', c), 'Error al crear el contacto');
export const deleteContactoAdmin = (id: number) => llamar(api.delete(`/admin/contactos/${id}`), 'Error al eliminar el contacto');

export const getAdministradores = () => llamar(api.get<Administrador[]>('/admin/administradores'), 'Error al obtener los administradores');
export const setRolAdmin = (datos: { email: string; rol: 'admin' | 'usuario' }) =>
    llamar(api.post<{ message: string }>('/admin/administradores', datos), 'Error al cambiar el rol');
