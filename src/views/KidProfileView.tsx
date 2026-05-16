import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteKid, getKidById, getKidHistory } from '../api/KidAPI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TestHistory } from '../types';
import { toast } from 'sonner';
import { useState } from 'react';
import ConfirmDeleteModal from '../components/ConfimDeleteModal';
import TestCardSkeleton from '../components/TestCardSkeleton';

export default function KidProfileView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Traemos los datos del niño
    const { data: kid, isLoading: isLoadingKid } = useQuery({
        queryKey: ['kid', id],
        queryFn: () => getKidById(id!),
        enabled: !!id
    });

    // Traemos el historial de evaluaciones
    const { data: history, isLoading: isLoadingHistory } = useQuery({
        queryKey: ['kidHistory', id],
        queryFn: () => getKidHistory(id!),
        enabled: !!id
    });

    const { mutate: deleteKidMutation } = useMutation({
        mutationFn: deleteKid,
        onError: (error: Error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('Paciente eliminado correctamente');
            queryClient.invalidateQueries({ queryKey: ['kids'] }); // Refresca la lista del dashboard
            navigate('/dashboard'); // Lo mandamos al inicio
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };


    if (isLoadingKid || isLoadingHistory) return (
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
            {/* Esqueleto del Encabezado */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border h-32 flex flex-col justify-center">
                <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>

            {/* Esqueleto de la Gráfica */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border h-96 flex items-center justify-center">
                <div className="w-full h-full bg-gray-100 rounded-xl"></div>
            </div>

            <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div> {/* Título "Historial de Evaluaciones" */}
                
                {/* Mostramos 3 tarjetas de test falsas */}
                {[...Array(3)].map((_, i) => (
                    <TestCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );

    // Preparamos los datos para la gráfica de Recharts (invertimos para ver del más antiguo al más reciente)
    const chartData = history?.map((test: TestHistory) => ({
        fecha: new Date(test.createdAt).toLocaleDateString(),
        puntaje: test.puntaje
    })).reverse() || [];

    const dynamicYAxisTicks = Array.from(new Set(chartData.map((item: { puntaje: number }) => item.puntaje)))
        .sort((a, b) => (a as number) - (b as number)) as number[];



    const confirmDelete = () => {
        deleteKidMutation(id!);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* ENCABEZADO Y BOTÓN DE NUEVO TEST */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link to="/dashboard" className="text-blue-600 hover:underline font-semibold text-sm mb-2 block">
                        &larr; Volver a Mis Pacientes
                    </Link>
                    <h1 className="text-3xl font-black text-gray-800">{kid?.nombre}</h1>
                    <p className="text-gray-500 mt-1">
                        Edad actual: <span className="font-bold">{kid?.edadCalculada}</span> | Escolarizado: <span className="font-bold">{kid?.escolarizacion ? 'Sí' : 'No'}</span>
                        {kid.observaciones && (
                            <span className="block mt-2 text-sm text-gray-600">
                                Observaciones: {kid.observaciones}
                            </span>
                        )}
                    </p>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Link
                        to={`/dashboard/kid/${id}/edit`} // <-- Ruta que crearemos enseguida
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl font-bold transition-colors text-center border border-blue-200"
                    >
                        Editar
                    </Link>

                    <button
                        onClick={handleDeleteClick}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl font-bold transition-colors text-center border border-red-200"
                    >
                        Eliminar
                    </button>

                    <Link
                        to={`/dashboard/kid/${id}/evaluate`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-sm hover:shadow-md text-center flex items-center justify-center gap-2"
                    >
                        Realizar Evaluación
                    </Link>
                </div>
            </div>

            {/* GRÁFICA EVOLUTIVA */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-xl font-bold mb-6 text-gray-800">
                    Seguimiento Longitudinal (Puntaje vs Tiempo)
                </h2>

                {chartData.length > 0 ? (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

                                <XAxis
                                    type='category'
                                    dataKey="fecha" // <-- CAMBIADO: Antes decía "puntaje", ahora usa la fecha para las etiquetas
                                    stroke="#6b7280"
                                    tick={{ fontSize: 12 }}
                                    padding={{ left: 20, right: 20 }}
                                    // Esto asegura que si hay muchas evaluaciones, no se encimen los textos
                                    interval="preserveStartEnd"
                                />

                                <YAxis
                                    domain={[0, 20]}
                                    ticks={dynamicYAxisTicks}
                                    stroke="#6b7280"
                                    tick={{ fontSize: 12, fontWeight: 'bold' }}
                                />

                                <Tooltip
                                    // El cursor "shadow" (strokeWidth alto) ayuda a seleccionar el área del punto más fácil
                                    cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(value) => `Fecha: ${value}`}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="puntaje" // <-- La línea sigue graficando el puntaje
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 8 }}
                                    // Agregamos esto para asegurar que cada punto sea independiente
                                    isAnimationActive={true}
                                    animationDuration={1000}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-10">No hay evaluaciones previas para generar la gráfica.</p>
                )}
            </div>

            {/* TABLA DE HISTORIAL */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Historial de Evaluaciones</h2>
                </div>

                {history?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-sm font-bold text-gray-700">Fecha</th>
                                    <th className="p-4 text-sm font-bold text-gray-700">Edad</th>
                                    <th className="p-4 text-sm font-bold text-gray-700">Puntaje</th>
                                    <th className="p-4 text-sm font-bold text-gray-700">Clasificación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map((test: TestHistory) => (
                                    <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-600">{new Date(test.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-gray-600">{kid.edadCalculada}</td>
                                        <td className="p-4 font-black text-gray-800">{test.puntaje}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${test.puntaje <= 5 ? 'bg-green-100 text-green-800' :
                                                test.puntaje <= 10 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {test.clasificacion}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-10">Aún no se ha realizado ninguna evaluación.</p>
                )}
            </div>
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                kidName={kid?.nombre}
            />
        </div>
    );
}