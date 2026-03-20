import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getKids } from '../api/KidAPI';
import type { Kid } from '../types';

export default function DashboardView() {
    // useQuery se encarga de llamar a la API, manejar el loading y guardar los datos en caché
    const { data: kids, isLoading, isError } = useQuery({
        queryKey: ['kids'], // Una llave única para la caché
        queryFn: getKids
    });

    if (isLoading) return <p className="text-center text-gray-500 py-20 font-bold text-xl">Cargando pacientes...</p>;
    if (isError) return <p className="text-center text-red-500 py-20 font-bold text-xl">Error al cargar la información.</p>;

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800">Mis Pacientes / Hijos</h1>
                    <p className="text-gray-500 mt-1">Administra los perfiles y evaluaciones</p>
                </div>
                
                <Link 
                    to="/dashboard/add-kid" 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full md:w-auto text-center"
                >
                    + Registrar Nuevo Niño
                </Link>
            </div>

            {/* Si el backend nos devuelve un arreglo vacío, mostramos el mensaje original */}
            {kids?.length === 0 ? (
                <div className="bg-white shadow-sm border rounded-2xl p-10 text-center">
                    <p className="text-gray-500 text-lg">
                        Aún no tienes niños registrados. Comienza agregando uno para realizar evaluaciones.
                    </p>
                </div>
            ) : (
                /* Si hay niños, iteramos sobre ellos y creamos una tarjeta para cada uno */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kids?.map((kid: Kid) => (
                        <div key={kid.id} className="bg-white shadow-sm border rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{kid.name}</h2>
                                <p className="text-gray-500 mt-2 text-sm">
                                    <span className="font-bold">Genero:</span> {kid.genero}
                                </p>
                                {/* Si tu backend manda la edad calculada, se mostrará aquí */}
                                {kid.edadCalculada && (
                                    <p className="text-gray-500 mt-1 text-sm">
                                        <span className="font-bold">Edad:</span> {kid.edadCalculada}
                                    </p>
                                )}
                            </div>
                            
                            <div className="mt-6 border-t pt-4">
                                <Link 
                                    to={`/dashboard/kid/${kid.id}`}
                                    className="text-blue-600 hover:text-blue-800 font-bold block text-center bg-blue-50 py-2 rounded-lg"
                                >
                                    Ver Perfil y Evaluaciones &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}