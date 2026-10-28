export default function ErrorMessage({ children }: { children: React.ReactNode }) {
    return (
        <p role="alert" className="mt-1 text-sm font-semibold text-rosa-fuerte">
            {children}
        </p>
    )
}
