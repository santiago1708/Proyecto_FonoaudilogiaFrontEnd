export default function EvaluateKidSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            {/* Simula el enlace de "Volver" */}
            <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {/* Simula el Título y la descripción */}
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-10"></div>

                {/* Simula las preguntas del test (mostraremos 5 bloques) */}
                <div className="space-y-10">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            {/* Simula el texto de la pregunta */}
                            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                            
                            {/* Simula las opciones de respuesta (ej. inputs, selects o radios) */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
                                <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simula el botón de Guardar Evaluación */}
                <div className="mt-10 pt-6 border-t border-gray-100">
                    <div className="h-14 bg-gray-200 rounded-xl w-full"></div>
                </div>
            </div>
        </div>
    );
}