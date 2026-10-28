import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

type Props = {
    etiqueta: string;
    valores: string[];
    onChange: (valores: string[]) => void;
    placeholder?: string;
    textoAgregar?: string;
};

// Lista editable de textos (pasos, recomendaciones…)
export default function EditorLista({ etiqueta, valores, onChange, placeholder, textoAgregar = 'Agregar' }: Props) {
    const cambiar = (i: number, v: string) => onChange(valores.map((x, j) => j === i ? v : x));
    const mover = (i: number, d: number) => {
        const copia = [...valores];
        [copia[i], copia[i + d]] = [copia[i + d], copia[i]];
        onChange(copia);
    };
    return (
        <fieldset className="space-y-2">
            <legend className="etiqueta mb-2">{etiqueta}</legend>
            {valores.map((v, i) => (
                <div key={i} className="flex items-start gap-2">
                    <span className="mt-3 w-6 shrink-0 text-right text-sm text-tinta-tenue">{i + 1}.</span>
                    <textarea
                        value={v}
                        onChange={e => cambiar(i, e.target.value)}
                        placeholder={placeholder}
                        rows={2}
                        aria-label={`${etiqueta} ${i + 1}`}
                        className="campo min-h-[3rem] flex-1 resize-y py-2"
                    />
                    <div className="flex flex-col">
                        <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} className="rounded-full p-1.5 hover:bg-lavanda disabled:opacity-30" aria-label="Subir"><ArrowUp className="h-4 w-4" /></button>
                        <button type="button" onClick={() => mover(i, 1)} disabled={i === valores.length - 1} className="rounded-full p-1.5 hover:bg-lavanda disabled:opacity-30" aria-label="Bajar"><ArrowDown className="h-4 w-4" /></button>
                    </div>
                    <button type="button" onClick={() => onChange(valores.filter((_, j) => j !== i))} className="mt-1.5 rounded-full p-2 text-rosa-fuerte hover:bg-rosa-suave" aria-label="Eliminar">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => onChange([...valores, ''])} className="boton-secundario px-4 py-2 text-sm">
                <Plus className="h-4 w-4" aria-hidden />{textoAgregar}
            </button>
        </fieldset>
    );
}
