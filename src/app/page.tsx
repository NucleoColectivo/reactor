import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, FlaskConical, Gamepad2, FolderOpen, UserPlus, Film, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { showcaseItems, coursePaths } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ReactorHero } from "@/components/common/reactor-hero";
import { NucleoLogo } from "@/components/icons/nucleo-logo";


const directAccessLinks = [
    {
        title: "Rutas de Aprendizaje",
        description: "Explora conceptos de IA desde lo básico hasta el prototipado de sistemas.",
        href: "/courses",
        icon: <BookOpen />,
    },
    {
        title: "Laboratorio de Creación",
        description: "Espacio para la creación y experimentación con herramientas audiovisuales interactivas.",
        href: "/laboratorio",
        icon: <FlaskConical />,
    },
    {
        title: "Sandbox de IA",
        description: "Un conjunto de herramientas de IA para experimentar libremente sin seguir una ruta.",
        href: "/sandbox",
        icon: <MessageSquare />,
    },
    {
        title: "ProMTS Lab",
        description: "Un IDE editorial para construir, probar y simular flujos de prompts complejos.",
        href: "/laboratorio/promts-lab",
        icon: <NucleoLogo className="h-4 w-4" />,
    },
    {
        title: "Videoarte Lab",
        description: "Generador visual IA, banco de loops y un editor narrativo experimental.",
        href: "/laboratorio/videoarte-lab",
        icon: <Film />,
    }
];

const activityStats = [
    {
        value: coursePaths.length.toString().padStart(2, '0'),
        label: "Rutas Activas",
        icon: <BookOpen />
    },
    {
        value: `${showcaseItems.length}`,
        label: "Experimentos en Vitrina",
        icon: <FolderOpen />
    },
    {
        value: "02",
        label: "Juegos en Curso",
        icon: <Gamepad2 />
    },
];

export default function LaboratorioHomePage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <ReactorHero />

      {/* Panel Actividad Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 mb-12 text-center">
                <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl highlight-bar">[ PANEL_DE_ACTIVIDAD ]</h2>
            </div>
            <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-3">
                {activityStats.map((stat) => (
                    <Card key={stat.label} className="text-center flex flex-col justify-center items-center p-4">
                       <div className="p-3 text-primary">
                          {stat.icon}
                        </div>
                        <p className="text-4xl md:text-6xl font-bold font-mono text-primary">{stat.value}</p>
                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{stat.label}</p>
                    </Card>
                ))}
            </div>
        </div>
      </section>
      
      {/* Accesos Directos Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 mb-12 text-center">
                 <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl highlight-bar">[ ACCESOS_DIRECTOS ]</h2>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {directAccessLinks.map((item) => (
                        <Card key={item.title} className="flex flex-col group">
                            <CardHeader>
                                <div className="flex-1">
                                    <CardTitle>{item.title}</CardTitle>
                                </div>
                                <div className="bg-primary/10 text-primary p-2">
                                    {item.icon}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="font-mono text-muted-foreground">{item.description}</p>
                            </CardContent>
                            <CardFooter>
                               <Button asChild variant="outline" className="w-full font-mono border-foreground hover:bg-primary hover:text-primary-foreground">
                                    <Link href={item.href}>
                                        INICIAR <ArrowRight className="ml-2 h-4 w-4"/>
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
      </section>

      {/* Vitrina del Laboratorio Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 mb-12 text-center">
                <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl highlight-bar">[ VITRINA_DEL_LABORATORIO ]</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl font-mono pt-4">
                  Proyectos, procesos y experimentos recientes de la comunidad.
                </p>
            </div>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {showcaseItems.filter(item => !(item.url.includes("youtube") || item.id === 'showcase-radio-nucleo')).slice(0, 8).map((item) => {
                        const image = PlaceHolderImages.find(p => p.id === item.imageId);
                        return (
                             <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                <Card className="flex flex-col group h-full">
                                    {image && (
                                        <div className="aspect-video overflow-hidden scanline-overlay">
                                            <Image
                                                alt={item.title}
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                height={300}
                                                src={image.imageUrl}
                                                width={400}
                                                data-ai-hint={image.imageHint}
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle>{item.title}</CardTitle>
                                        <CardDescription>{item.author}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                         <p className="font-mono text-muted-foreground text-sm line-clamp-3">{item.description}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild variant="secondary" className="w-full font-mono">
                                            <Link href={item.url} target="_blank" rel="noopener noreferrer">
                                                VER_PROCESO <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                                </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
            </Carousel>
        </div>
      </section>

      {/* Become a node section */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-primary text-primary-foreground">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 md:px-6 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline">ÚNETE AL LABORATORIO</h2>
            <p className="font-mono max-w-2xl mx-auto">
              La sintaxis es una estructura de conexión. Cada nodo es un punto de partida para nuevas ideas. Explora, crea y comparte.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="font-mono text-lg px-12 py-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href="/login">
              [ CREAR_CUENTA_O_ACCEDER ]
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
