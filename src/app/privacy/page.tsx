import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container py-12 md:py-24 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Política de Privacidad</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>Última actualización: [Fecha]</p>
          
          <h2>1. Introducción</h2>
          <p>Bienvenido a Núcleo Colectivo. Respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política de privacidad te informará sobre cómo cuidamos tus datos personales cuando visitas nuestro sitio web (independientemente de dónde lo visites) y te informará sobre tus derechos de privacidad y cómo la ley te protege.</p>

          <h2>2. Datos que recopilamos sobre ti</h2>
          <p>Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre ti, que hemos agrupado de la siguiente manera:</p>
          <ul>
            <li><strong>Datos de Identidad:</strong> incluye nombre, apellido, nombre de usuario o identificador similar.</li>
            <li><strong>Datos de Contacto:</strong> incluye dirección de correo electrónico y números de teléfono.</li>
            <li><strong>Datos Técnicos:</strong> incluye la dirección del protocolo de Internet (IP), tus datos de inicio de sesión, el tipo y la versión del navegador, la configuración y ubicación de la zona horaria, los tipos y versiones de los complementos del navegador, el sistema operativo y la plataforma, y otra tecnología en los dispositivos que utilizas para acceder a este sitio web.</li>
            <li><strong>Datos de Uso:</strong> incluye información sobre cómo utilizas nuestro sitio web, productos y servicios.</li>
          </ul>

          <h2>3. Cómo se recopilan tus datos personales</h2>
          <p>Utilizamos diferentes métodos para recopilar datos de y sobre ti, incluyendo:</p>
          <ul>
              <li><strong>Interacciones directas.</strong> Puedes darnos tu identidad y datos de contacto rellenando formularios o contactándonos por correo, teléfono u otro medio.</li>
              <li><strong>Tecnologías o interacciones automatizadas.</strong> A medida que interactúas con nuestro sitio web, podemos recopilar automáticamente Datos Técnicos sobre tu equipo, acciones de navegación y patrones.</li>
          </ul>

          <h2>4. Cómo usamos tus datos personales</h2>
          <p>Usaremos tus datos personales solo cuando la ley nos lo permita. Generalmente, usaremos tus datos personales en las siguientes circunstancias:</p>
          <ul>
            <li>Cuando necesitemos ejecutar el contrato que estamos a punto de celebrar o hemos celebrado contigo.</li>
            <li>Cuando sea necesario para nuestros intereses legítimos (o los de un tercero) y tus intereses y derechos fundamentales no prevalezcan sobre esos intereses.</li>
            <li>Cuando necesitemos cumplir con una obligación legal o regulatoria.</li>
          </ul>

          <h2>5. Seguridad de los datos</h2>
          <p>Hemos implementado medidas de seguridad apropiadas para evitar que tus datos personales se pierdan accidentalmente, se usen o se acceda a ellos de forma no autorizada, se alteren o se divulguen. Además, limitamos el acceso a tus datos personales a aquellos empleados, agentes, contratistas y otros terceros que tienen una necesidad comercial de conocerlos.</p>

          <h2>6. Tus derechos legales</h2>
          <p>Bajo ciertas circunstancias, tienes derechos bajo las leyes de protección de datos en relación con tus datos personales. Estos incluyen el derecho a solicitar acceso, corrección, eliminación, restricción, transferencia, y a oponerte al procesamiento.</p>
        </CardContent>
      </Card>
    </div>
  );
}
