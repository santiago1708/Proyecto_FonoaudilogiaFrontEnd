import { Link } from 'react-router-dom';

// BORRADOR: el texto debe ser revisado y aprobado por las autoras y la institución
// antes de publicar la aplicación. Ajusta el responsable y el correo de contacto.
const RESPONSABLE = 'el equipo del proyecto FonoAlerta (Programa de Fonoaudiología)';
const CORREO_CONTACTO = import.meta.env.VITE_CORREO_CONTACTO as string | undefined;

const Seccion = ({ titulo, children }: { titulo: string; children: React.ReactNode }) => (
    <section className="space-y-2">
        <h2 className="text-lg font-extrabold">{titulo}</h2>
        <div className="space-y-2 text-tinta-suave">{children}</div>
    </section>
);

export default function PoliticaPrivacidadView() {
    return (
        <article className="space-y-6">
            <header>
                <h1 className="font-mano text-4xl">Política de privacidad</h1>
                <p className="mt-1 text-sm text-tinta-tenue">Tratamiento de datos personales conforme a la Ley 1581 de 2012 (Colombia).</p>
            </header>

            <Seccion titulo="Responsable">
                <p>Los datos registrados en FonoAlerta son tratados por {RESPONSABLE}.</p>
            </Seccion>

            <Seccion titulo="Datos que se recogen">
                <p>De la persona usuaria: nombre, correo electrónico, contraseña (guardada cifrada) y tipo de usuario.</p>
                <p>De cada niño o niña: nombre, fecha de nacimiento, sexo, escolarización, observaciones opcionales y las respuestas de las evaluaciones con sus resultados.</p>
                <p>Las respuestas sobre el desarrollo del lenguaje se consideran datos sensibles de menores de edad. Su registro es voluntario.</p>
            </Seccion>

            <Seccion titulo="Para qué se usan">
                <p>Solo para calcular el resultado orientativo de cada evaluación, mostrar recomendaciones y actividades, y permitir el seguimiento del niño o niña en el tiempo. No se venden ni se comparten con terceros.</p>
            </Seccion>

            <Seccion titulo="Contacto por WhatsApp">
                <p>El contacto con un fonoaudiólogo es voluntario. La aplicación no envía resultados ni datos del niño o niña; si decides compartirlos, lo haces tú directamente.</p>
            </Seccion>

            <Seccion titulo="Tus derechos">
                <p>Puedes conocer, actualizar, rectificar y eliminar tus datos. Desde la aplicación puedes editar o eliminar el perfil de cada niño o niña, lo que borra también su historial de evaluaciones.</p>
                {CORREO_CONTACTO && <p>Para otras solicitudes escribe a <a className="font-bold text-brand-700 underline" href={`mailto:${CORREO_CONTACTO}`}>{CORREO_CONTACTO}</a>.</p>}
            </Seccion>

            <Seccion titulo="Carácter orientativo">
                <p>Los resultados de FonoAlerta tienen carácter orientativo y no sustituyen una valoración fonoaudiológica.</p>
            </Seccion>

            <Link to="/register" className="boton-secundario">Volver al registro</Link>
        </article>
    );
}
