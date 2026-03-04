import { coursePaths } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Baby, GraduationCap, Rocket } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function CoursesPage() {
    
    return (
        <div className="container relative py-12 md:py-24">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold font-headline tracking-tighter sm:text-7xl">RUTAS DE APRENDIZAJE</h1>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-mono">
                       Aquí no se “toma un curso”. Se construye pensamiento, proceso y obra. Cada ruta es una invitación a explorar la IA como un fenómeno cultural, no solo como una herramienta. Elige un camino.
                    </p>
                </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
                 {coursePaths.map((path) => {
                    const image = PlaceHolderImages.find(p => p.id === path.imageId);
                    return (
                        <Card key={path.level} className="flex flex-col group">
                           {image && (
                                <div className="aspect-video overflow-hidden scanline-overlay">
                                    <Image
                                        alt={path.title}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                        height={300}
                                        src={image.imageUrl}
                                        width={400}
                                        data-ai-hint={image.imageHint}
                                    />
                                </div>
                           )}
                            <CardHeader>
                                <div className="flex-1">
                                  <CardTitle>{path.spanishLevel}</CardTitle>
                                  <CardDescription className="text-foreground/80 mt-1">{path.title}</CardDescription>
                                </div>
                                <div className="text-right shrink-0 font-mono">
                                    <div className="font-bold text-4xl text-primary">{path.modules.length}</div>
                                    <div className="text-xs text-muted-foreground">MODULOS</div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="font-mono text-muted-foreground">{path.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full font-mono">
                                    <Link href={`/courses/${path.level.toLowerCase()}`}>
                                        EXPLORAR_RUTA <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
