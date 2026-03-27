export default function KidCardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse flex flex-col justify-between h-full">
            <div>
                {/* Simula el nombre del paciente */}
                <div className="h-7 bg-gray-200 rounded-full w-3/4 mb-4"></div>

                {/* Simula los datos (edad, escolarizado) */}
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                </div>
            </div>

            {/* Simula los botones de acción inferiores */}
            <div className="mt-8 flex gap-3">
                <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
            </div>
        </div>
    );
}