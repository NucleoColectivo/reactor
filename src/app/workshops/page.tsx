'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Building2 } from "lucide-react";
import Link from 'next/link';


export default function WorkshopsPage() {
    return (
        <div className="container relative py-12 md:py-24 max-w-5xl mx-auto">
            
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-glow">
                    Talleres de IA para Procesos Creativos
                </h1>
                <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground font-mono">
                    Núcleo Colectivo es una plataforma de creación, formación y colaboración que articula arte, tecnología, inteligencia artificial y cultura desde una perspectiva crítica, accesible y situada.
                </p>
            </div>

            <Card className="mb-12 system-border">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Un Nuevo Enfoque Formativo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground font-mono">
                    <p>Los talleres de Núcleo Colectivo no son cursos tradicionales: son laboratorios de experimentación, donde la inteligencia artificial se integra como una herramienta de apoyo al proceso creativo, no como fin en sí misma.</p>
                    <p>Nuestra metodología se basa en el aprendizaje activo (<strong className="font-semibold text-foreground">learning by doing</strong>), la valoración del proceso sobre la herramienta y la facilitación consciente y horizontal. Buscamos democratizar el acceso a herramientas de IA, fomentar la creación y promover la autonomía creativa.</p>
                </CardContent>
            </Card>

            <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">¿Cómo deseas colaborar?</h2>
                 <p className="max-w-2xl mx-auto mt-2 text-muted-foreground font-mono">
                    Ofrecemos formatos flexibles para adaptarnos a tus necesidades, ya seas un creador individual, un grupo pequeño o una institución.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <Card className="flex flex-col system-border">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline flex items-center gap-3"><Users className="text-primary"/>Para Individuos y Grupos</CardTitle>
                        <CardDescription className="font-mono">¿Quieres tomar un taller para ti o para un grupo pequeño? Contáctanos directamente para explorar opciones personalizadas.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground font-mono">
                            <li>Formatos flexibles en duración y contenido.</li>
                            <li>Acompañamiento cercano y personalizado.</li>
                            <li>Ideal para artistas, diseñadores y creativos curiosos.</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full font-mono" size="lg">
                            <a href="https://wa.me/573006101221?text=Hola,%20me%20interesa%20un%20taller%20de%20IA%20creativa%20para%20mí%20o%20mi%20grupo." target="_blank" rel="noopener noreferrer">
                                <MessageSquare className="mr-2"/> CONTACTAR_POR_WHATSAPP
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col system-border border-primary/50 shadow-primary/10 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline flex items-center gap-3"><Building2 className="text-primary"/>Para Instituciones</CardTitle>
                        <CardDescription className="font-mono">Si representas una universidad, museo, empresa o centro cultural, contáctanos para diseñar una propuesta a la medida.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground font-mono">
                            <li>Programas modulares y escalables (16h, 24h, etc.).</li>
                            <li>Diseño pedagógico adaptado a tus objetivos.</li>
                            <li>Un modelo de precios transparente y profesional.</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button asChild className="w-full font-mono" size="lg">
                            <a href="https://wa.me/573006101221?text=Hola,%20me%20interesa%20una%20propuesta%20institucional%20para%20un%20taller%20de%20IA%20creativa." target="_blank" rel="noopener noreferrer">
                                <MessageSquare className="mr-2"/> CONTACTO_INSTITUCIONAL
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </div>
    );
}
