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
                    <div className="bg-red-50 p-4 rounded-full mb-4 border border-brand-100 border-rosa/30">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    
                    {/* Textos */}
                    <h3 className="text-2xl font-extrabold text-tinta mb-2">
                        ¿Eliminar este perfil?
                    </h3>
                    <p className="text-tinta-suave mb-8 leading-relaxed">
                        Estás a punto de eliminar a <span className="font-bold text-tinta">{kidName}</span>. 
                        Esta acción borrará todo su historial de evaluaciones y <span className="font-semibold text-rosa-fuerte">no se puede deshacer</span>.
                    </p>
                    
                    {/* Botones */}
                    <div className="flex w-full gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-lavanda hover:bg-brand-100 text-tinta font-bold py-3.5 rounded-xl transition-colors"
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