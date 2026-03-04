"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { NucleoLogo } from "../icons/nucleo-logo";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/courses", label: "Rutas" },
  { href: "/laboratorio", label: "Laboratorio" },
  { href: "/sandbox", label: "Sandbox" },
  { href: "/genesis-imagen", label: "Génesis" },
  { href: "/juego-ia", label: "Juego IA" },
  { href: "/etica-ia", label: "Ética IA" },
  { href: "/movies-ia", label: "Movies IA" },
  { href: "/archivo", label: "VITRINA" },
  { href: "/workshops", label: "Talleres" },
];

export function Header() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-foreground bg-background">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <NucleoLogo className="h-10 text-foreground" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-mono uppercase">
            {isClient && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname.startsWith(link.href)
                    ? "text-primary font-bold"
                    : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-r-2 border-foreground">
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
            <div className="mt-6 flex flex-col space-y-4 font-mono uppercase">
              <Link
                href="/"
                className="flex items-center space-x-2"
              >
                <NucleoLogo className="h-10 text-foreground" />
              </Link>
              {isClient && navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-primary text-lg",
                    pathname.startsWith(link.href)
                      ? "text-primary font-bold"
                      : "text-foreground/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-4 font-mono">
                <Link href="https://studio--ncleo-colectivo2-2240264-c40e3.us-central1.hosted.app/" target="_blank" rel="noopener noreferrer">
                    WEB Núcleo Colectivo
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button asChild className="hidden md:inline-flex font-mono">
            <Link href="https://studio--ncleo-colectivo2-2240264-c40e3.us-central1.hosted.app/" target="_blank" rel="noopener noreferrer">
                WEB Núcleo Colectivo
            </Link>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
