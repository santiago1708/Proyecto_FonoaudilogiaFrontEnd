export default function Cargando({ texto = 'Cargando…' }: { texto?: string }) {
    return (
        <div role="status" className="flex items-center justify-center gap-3 py-20 text-tinta-suave">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden />
            {texto}
        </div>
    );
}
