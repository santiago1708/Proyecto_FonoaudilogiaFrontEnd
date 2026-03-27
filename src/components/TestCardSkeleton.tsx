export default function TestCardSkeleton() {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Sección Izquierda: Fecha y título */}
            <div className="space-y-3 w-full md:w-1/2">
                <div className="h-5 bg-gray-200 rounded-full w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
            </div>

            {/* Sección Central: Puntaje */}
            <div className="flex flex-col items-start md:items-center w-full md:w-1/4 space-y-2">
                <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                <div className="h-8 bg-gray-200 rounded-full w-16"></div>
            </div>

            {/* Sección Derecha: Botón de acción (Ver detalles / Eliminar) */}
            <div className="w-full md:w-auto mt-2 md:mt-0">
                <div className="h-10 bg-gray-200 rounded-xl w-full md:w-28"></div>
            </div>
            
        </div>
    );
}