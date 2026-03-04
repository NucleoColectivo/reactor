import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MessageSquare, ImageIcon, TestTube, Users, Wrench, Music } from "lucide-react";

const sandboxTools = [
    {
        title: "Diálogos con IA",
        description: "Explora ideas, haz preguntas y colabora con una IA entrenada para el pensamiento crítico y creativo.",
        href: "/courses/basic/b2",
        icon: <MessageSquare />,
    },
    {
        title: "Generador Visual",
        description: "Crea imágenes a partir de texto, combinando estilos y parámetros para refinar tu visión.",
        href: "/courses/intermediate/i1",
        icon: <ImageIcon />,
    },
    {
        title: "Voz y Sonido con IA",
        description: "Convierte texto en voz. Escribe un guion, una idea o un poema y escucha cómo la IA lo interpreta.",
        href: "/courses/intermediate/i5",
        icon: <Music />,
    },
    {
        title: "Ajuste Fino (Simulado)",
        description: "Define la 'personalidad' o las instrucciones base de una IA para especializarla en tareas concretas.",
        href: "/courses/advanced/a3",
        icon: <TestTube />,
    },
    {
        title: "Agentes Colaborativos",
        description: "Observa cómo dos IAs (Planificador y Ejecutor) colaboran para resolver una tarea compleja.",
        href: "/courses/advanced/a4",
        icon: <Users />,
    },
    {
        title: "Recomendador de Herramientas",
        description: "Recibe recomendaciones de herramientas y recursos de IA según tu nivel y perfil.",
        href: "/courses/intermediate/i4",
        icon: <Wrench />,
    },
];

export default function SandboxPage() {
    return (
        <div className="container py-12 md:py-24">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold font-headline tracking-tighter sm:text-7xl highlight-bar">SANDBOX DE IA</h1>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-mono">
                       Un espacio para experimentar sin estructura rígida. Aquí puedes interactuar directamente con diferentes herramientas de IA para jugar, crear y descubrir.
                    </p>
                </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
                 {sandboxTools.map((tool) => (
                    <Card key={tool.title} className="flex flex-col group">
                        <CardHeader>
                            <div className="flex-1">
                                <CardTitle>{tool.title}</CardTitle>
                            </div>
                            <div className="bg-primary/10 text-primary p-2">
                                {tool.icon}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="font-mono text-muted-foreground">{tool.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full font-mono">
                                <Link href={tool.href}>
                                    EXPERIMENTAR <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
