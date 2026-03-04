import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container py-12 md:py-24 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Términos y Condiciones</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>Última actualización: [Fecha]</p>

          <h2>1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar el sitio web de Núcleo Colectivo, aceptas cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro sitio web.</p>
          
          <h2>2. Propiedad Intelectual</h2>
          <p>El contenido, la organización, los gráficos, el diseño, la compilación y otros asuntos relacionados con el Sitio están protegidos por las leyes de derechos de autor y marcas registradas aplicables. La copia, redistribución, uso o publicación por tu parte de cualquiera de dichos asuntos o cualquier parte del Sitio está estrictamente prohibida.</p>

          <h2>3. Contenido del Usuario</h2>
          <p>Eres el único responsable de cualquier dato, texto, imagen, video u otro material ("Contenido del Usuario") que cargues, publiques o muestres en nuestro servicio. Al publicar tu Contenido de Usuario, nos otorgas una licencia no exclusiva, mundial, libre de regalías para usar, modificar, ejecutar públicamente, mostrar públicamente, reproducir y distribuir dicho Contenido de Usuario en y a través del servicio.</p>

          <h2>4. Conducta del Usuario</h2>
          <p>Aceptas no utilizar el Servicio para:</p>
          <ul>
            <li>Cargar o transmitir cualquier contenido que sea ilegal, dañino, amenazante, abusivo, acosador, difamatorio, vulgar, obsceno o de otra manera objetable.</li>
            <li>Hacerte pasar por cualquier persona o entidad, o declarar falsamente o tergiversar de otro modo tu afiliación con una persona o entidad.</li>
            <li>Cargar o transmitir cualquier publicidad no solicitada o no autorizada, materiales promocionales, "correo basura", "spam", "cartas en cadena", "esquemas piramidales" o cualquier otra forma de solicitud.</li>
          </ul>

          <h2>5. Limitación de Responsabilidad</h2>
          <p>En ningún caso Núcleo Colectivo será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluyendo, sin limitación, la pérdida de ganancias, datos, uso, buena voluntad u otras pérdidas intangibles, que resulten de (i) tu acceso o uso o incapacidad para acceder o usar el servicio; (ii) cualquier conducta o contenido de cualquier tercero en el servicio.</p>

          <h2>6. Cambios a los Términos</h2>
          <p>Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que los nuevos términos entren en vigencia. Lo que constituye un cambio material será determinado a nuestra sola discreción.</p>

        </CardContent>
      </Card>
    </div>
  );
}
