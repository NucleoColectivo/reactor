'use client';

import { useState } from 'react';
import { ethicsVideos, type EthicsVideo } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, BrainCircuit, Scale, Users, Bot, BookOpen, Eye, Train, Gavel, Film, ArrowDown } from "lucide-react";
import Image from "next/image";
import { VideoModal } from '@/components/common/video-modal';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BiasLab } from '@/components/game/bias-lab';
import { MoralDilemmasLab } from '@/components/game/moral-dilemmas-lab';

const ethicsGames = [
    {
        id: "sesgos",
        title: "Laboratorio de Sesgos",
        description: "Detecta lo invisible. Genera imágenes, analiza los patrones y aprende a 'hackear' el sesgo algorítmico.",
        icon: <Scale />,
        status: "Activo"
    },
    {
        id: "dilemas",
        title: "Dilemas Morales",
        description: "Enfrenta decisiones complejas en un simulador narrativo y observa las consecuencias de tus elecciones.",
        icon: <Train />,
        status: "Activo"
    },
    {
        id: "real_falso",
        title: "Detector de Impostores",
        description: "Pon a prueba tu intuición en un juego rápido para diferenciar contenido real de contenido generado por IA.",
        icon: <Bot />,
        status: "Próximamente"
    },
    {
        id: "caja_transparente",
        title: "La Caja Transparente",
        description: "Compara un sistema de IA de 'caja negra' con uno transparente y entiende el valor de la explicabilidad.",
        icon: <Eye />,
        status: "Próximamente"
    },
    {
        id: "eco_datos",
        title: "El Eco de los Datos",
        description: "Visualiza cómo tus datos ficticios viajan y son utilizados para crear perfiles y predicciones.",
        icon: <BookOpen />,
        status: "Próximamente"
    },
    {
        id: "impacto_social",
        title: "Simulador de Ciudad IA",
        description: "Gobierna una ciudad y toma decisiones sobre la implementación de IA, sopesando sus consecuencias.",
        icon: <Gavel />,
        status: "Próximamente"
    }
];

// Group videos by category
const videoCategories = ethicsVideos.reduce((acc, video) => {
    (acc[video.category] = acc[video.category] || []).push(video);
    return acc;
}, {} as Record<EthicsVideo['category'], EthicsVideo[]>);

const categoryOrder: EthicsVideo['category'][] = ['Fundamentos', 'Sesgos y Datos', 'Derechos y Futuro', 'Diseño Responsable', 'Debates', 'Documental'];

const categoryIcons: { [key in EthicsVideo['category']]: React.ReactNode } = {
    'Fundamentos': <BookOpen />,
    'Sesgos y Datos': <Scale />,
    'Derechos y Futuro': <BrainCircuit />,
    'Diseño Responsable': <Users />,
    'Debates': <Bot />,
    'Documental': <Film />,
};

export default function EticaIAPage() {
    const [labStarted, setLabStarted] = useState(false);
    const [activeGame, setActiveGame] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [selectedVideoTitle, setSelectedVideoTitle] = useState<string | null>(null);

    const handlePlayVideo = (video: EthicsVideo) => {
        setSelectedVideoId(video.videoId);
        setSelectedVideoTitle(video.title);
        setModalOpen(true);
    };

    const getGameComponent = (gameId: string | null) => {
        switch (gameId) {
            case 'sesgos':
                return <BiasLab />;
            case 'dilemas':
                return <MoralDilemmasLab />;
            default:
                return <p className="text-center text-muted-foreground p-8">Este juego aún está en desarrollo. ¡Vuelve pronto!</p>;
        }
    };
    
    if (!labStarted) {
        return (
            <div className="container py-12 md:py-24 flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
                 <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter sm:text-7xl mb-8">
                    ¿Confiarías tu reputación a un algoritmo que no entiendes?
                </h1>
                <Button size="lg" onClick={() => setLabStarted(true)}>
                    [ Entrar al laboratorio ]
                </Button>
                <p className="text-xs text-muted-foreground mt-8 animate-pulse">Advertencia: aquí no damos respuestas cómodas.</p>
            </div>
        )
    }

    return (
        <>
            <div className="container py-12 md:py-24">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold font-headline tracking-tighter sm:text-7xl highlight-bar">Laboratorio de Ética IA</h1>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-mono">
                           Un espacio interactivo para explorar los dilemas y responsabilidades de crear con inteligencia artificial a través de juegos, simulaciones y una videoteca curada.
                        </p>
                    </div>
                </div>

                <div className="mb-20">
                     <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl mb-8 text-center">Juegos y Simulaciones Éticas</h2>
                     <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {ethicsGames.map((game) => (
                            <Card key={game.id} className="flex flex-col group cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveGame(game.id)}>
                                <CardHeader>
                                    <div className="flex-1">
                                      <CardTitle>{game.title}</CardTitle>
                                    </div>
                                    <div className="bg-primary/10 text-primary p-3">
                                        {game.icon}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="font-mono text-muted-foreground">{game.description}</p>
                                </CardContent>
                                <CardFooter className="flex-col items-stretch">
                                    <Badge variant={game.status === 'Activo' ? 'default' : 'outline'} className="w-fit self-center">{game.status}</Badge>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                     <Button asChild size="lg" variant="outline">
                        <Link href="#videoteca">
                            Explorar Videoteca
                            <ArrowDown className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                
                <Separator className="my-20" />

                <div id="videoteca" className="space-y-16 mt-16">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">Videoteca Crítica</h2>
                         <p className="max-w-[900px] mx-auto mt-2 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-mono">
                           Conferencias, paneles y debates sobre los desafíos éticos, sociales y culturales de la inteligencia artificial.
                        </p>
                    </div>
                    {categoryOrder.map(category => (
                        videoCategories[category] && (
                            <div key={category}>
                                <h3 className="text-2xl font-bold font-headline tracking-tighter sm:text-3xl mb-8 flex items-center gap-4">
                                    <div className="bg-primary/10 text-primary p-3">{categoryIcons[category]}</div>
                                    {category}
                                </h3>
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {videoCategories[category].map((video) => {
                                        return (
                                            <Card key={video.id} className="flex flex-col group cursor-pointer" onClick={() => handlePlayVideo(video)}>
                                                <div className="aspect-video overflow-hidden relative scanline-overlay">
                                                     <Image
                                                        alt={video.title}
                                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                        height={225}
                                                        src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                                                        width={400}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                         <PlayCircle className="h-16 w-16 text-white" />
                                                    </div>
                                                </div>
                                                <CardHeader>
                                                    <CardTitle className="text-base font-bold !text-foreground leading-tight">{video.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="flex-grow">
                                                    <p className="font-mono text-xs text-muted-foreground">{video.description}</p>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button onClick={(e) => { e.stopPropagation(); handlePlayVideo(video); }} className="w-full font-mono">
                                                        <PlayCircle className="mr-2 h-4 w-4" />
                                                        VER_VIDEO
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
            
             <Dialog open={!!activeGame} onOpenChange={() => setActiveGame(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl text-primary">
                            {ethicsGames.find(g => g.id === activeGame)?.title}
                        </DialogTitle>
                    </DialogHeader>
                    {getGameComponent(activeGame)}
                </DialogContent>
            </Dialog>

            <VideoModal
                isOpen={modalOpen}
                setIsOpen={setModalOpen}
                videoId={selectedVideoId}
                title={selectedVideoTitle}
            />
        </>
    );
}
