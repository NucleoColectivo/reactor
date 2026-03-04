import { Instagram, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { NucleoLogo } from "../icons/nucleo-logo";

export function Footer() {
  return (
    <footer className="bg-secondary text-muted-foreground border-t-2 border-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <NucleoLogo className="h-12 text-foreground mb-4" />
            <p className="text-sm max-w-xs font-mono">
              Workspace para aprender, experimentar y publicar con Inteligencia Artificial.
            </p>
            <div className="flex space-x-2 mt-4">
              <Link href="https://www.instagram.com/nucleo_colectivo_art/" target="_blank" rel="noreferrer" className="p-2 border border-foreground/20 hover:bg-muted transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="mailto:nucleo.colectivo.art@gmail.com" className="p-2 border border-foreground/20 hover:bg-muted transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline text-sm tracking-wider uppercase text-foreground">Aprende</h4>
            <ul className="mt-4 space-y-2 text-sm font-mono">
              <li>
                <Link href="/courses" className="hover:text-foreground transition-colors">Rutas</Link>
              </li>
               <li>
                <Link href="/workshops" className="hover:text-foreground transition-colors">Talleres</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-headline text-sm tracking-wider uppercase text-foreground">Experimenta</h4>
            <ul className="mt-4 space-y-2 text-sm font-mono">
              <li>
                <Link href="/laboratorio" className="hover:text-foreground transition-colors">Laboratorio</Link>
              </li>
               <li>
                <Link href="/archivo" className="hover:text-foreground transition-colors">VITRINA</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-sm tracking-wider uppercase text-foreground">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm font-mono">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">Términos</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-sm tracking-wider uppercase text-foreground">Comunidad</h4>
            <Button asChild variant="outline" className="mt-4 border-foreground hover:bg-foreground hover:text-background font-mono">
                <Link href="/login">
                    ACCEDER
                </Link>
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs gap-4 font-mono">
          <p>&copy; {new Date().getFullYear()} Núcleo Colectivo. Todos los derechos reservados.</p>
          <p className="tracking-widest">MEDELLÍN - ANTIOQUIA</p>
        </div>
      </div>
    </footer>
  );
}
