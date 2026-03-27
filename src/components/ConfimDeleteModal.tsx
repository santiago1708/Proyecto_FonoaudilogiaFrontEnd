import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    kidName?: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, kidName }: ConfirmDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo oscuro con desenfoque (backdrop) */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Contenedor del Modal */}
            <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    
                    {/* Ícono de advertencia */}
                    <div className="bg-red-50 p-4 rounded-full mb-4 border border-red-100">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    
                    {/* Textos */}
                    <h3 className="text-2xl font-black text-gray-800 mb-2">
                        ¿Eliminar paciente?
                    </h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Estás a punto de eliminar a <span className="font-bold text-gray-700">{kidName}</span>. 
                        Esta acción borrará todo su historial de evaluaciones y <span className="font-semibold text-red-600">no se puede deshacer</span>.
                    </p>
                    
                    {/* Botones */}
                    <div className="flex w-full gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm hover:shadow-md"
                        >
                            Sí, eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}