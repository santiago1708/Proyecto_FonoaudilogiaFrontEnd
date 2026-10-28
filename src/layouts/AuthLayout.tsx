import { Link, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

export default function AuthLayout() {
    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center bg-lavanda px-4 py-10">
                <Link to="/login" aria-label="FonoAlerta">
                    <img src="/logo-fonoalerta.png" alt="FonoAlerta" className="mx-auto h-40 w-auto sm:h-48" />
                </Link>
                <div className="mt-6 w-full max-w-md rounded-[2rem] bg-white p-6 shadow-suave sm:p-8">
                    <Outlet />
                </div>
                <p className="mt-6 text-center text-sm text-tinta-tenue">
                    <Link to="/politica-privacidad" className="hover:underline">Política de privacidad</Link>
                </p>
            </div>
            <Toaster position="top-right" richColors />
        </>
    )
}
