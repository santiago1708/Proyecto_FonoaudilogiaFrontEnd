import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

export default function AuthLayout() {
    return (
        <>
            <div className="bg-blue-50 min-h-screen flex items-center justify-center p-5">
                <div className="max-w-md w-full">
                    {/* Aquí podrías agregar tu componente <Logo /> */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl mt-10">
                        <Outlet />
                    </div>
                </div>
            </div>
            <Toaster position="top-right" richColors />
        </>
    )
}