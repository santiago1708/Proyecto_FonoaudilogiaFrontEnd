import { Info } from 'lucide-react';

export default function AvisoOrientativo({ texto }: { texto?: string }) {
    return (
        <p className="flex gap-3 rounded-2xl border border-cielo/30 bg-cielo-suave p-4 text-sm text-tinta-suave">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-cielo" aria-hidden />
            <span>{texto ?? 'Los resultados de FonoAlerta tienen carácter orientativo y no sustituyen una valoración fonoaudiológica.'}</span>
        </p>
    );
}
