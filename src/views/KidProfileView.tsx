import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getKidById, getKidHistory } from '../api/KidAPI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TestHistory } from '../types';

export default function KidProfileView() {
    const { id } = useParams<{ id: string }>();

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

    if (isLoadingKid || isLoadingHistory) return <p className="text-center py-20 font-bold text-xl text-gray-500">Cargando perfil...</p>;

    // Preparamos los datos para la gráfica de Recharts (invertimos para ver del más antiguo al más reciente)
    const chartData = history?.map((test: TestHistory) => ({
        fecha: new Date(test.createdAt).toLocaleDateString(),
        puntaje: test.puntaje
    })).reverse() || [];

    const dynamicYAxisTicks = Array.from(new Set(chartData.map((item: { puntaje: number }) => item.puntaje)))
        .sort((a, b) => (a as number) - (b as number)) as number[];

    console.log(chartData)

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* ENCABEZADO Y BOTÓN DE NUEVO TEST */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <Link to="/dashboard" className="text-blue-600 hover:underline font-semibold text-sm mb-2 block">
                        &larr; Volver a Mis Pacientes
                    </Link>
                    <h1 className="text-3xl font-black text-gray-800">{kid?.nombre}</h1>
                    <p className="text-gray-500 mt-1">
                        Edad actual: <span className="font-bold">{kid?.edadCalculada}</span> | Escolarizado: <span className="font-bold">{kid?.escolarizado ? 'Sí' : 'No'}</span>
                    </p>
                </div>

                <Link
                    to={`/dashboard/kid/${id}/evaluate`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md w-full md:w-auto text-center flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Realizar Evaluación
                </Link>
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
                                        <td className="p-4 text-gray-600">{test.edadAlMomento}</td>
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
        </div>
    );
}