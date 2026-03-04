'use client';

import { useState } from 'react';
import { aiMovies, aiYouTubeContent, type YouTubeContent, type Movie } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Film, Youtube } from "lucide-react";
import Image from "next/image";
import { VideoModal } from '@/components/common/video-modal';
import { MovieInfoModal } from '@/components/common/movie-info-modal';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

// Group videos by category
const videoCategories = aiYouTubeContent.reduce((acc, video) => {
    (acc[video.category] = acc[video.category] || []).push(video);
    return acc;
}, {} as Record<YouTubeContent['category'], YouTubeContent[]>);

const categoryOrder: YouTubeContent['category'][] = ['Serie Documental', 'Documental', 'Análisis y Debate', 'Película Completa'];

const categoryDescriptions: Record<string, string> = {
    'Serie Documental': "Las series documentales nos permiten profundizar en el impacto de la IA a través de varios episodios. Producciones como 'La Era de la IA' nos llevan de la mano para entender cómo esta tecnología ya está transformando la ciencia, el trabajo y nuestra vida cotidiana.",
    'Documental': "Estos documentales ofrecen una investigación rigurosa sobre el estado actual de la IA. Desde análisis críticos sobre los sesgos algorítmicos hasta la carrera geopolítica por la supremacía tecnológica, son piezas clave para entender el panorama completo.",
    'Análisis y Debate': "En esta sección, agrupamos videos más cortos que ofrecen análisis concisos, debates entre expertos y explicaciones pedagógicas. Son ideales para desempacar conceptos específicos o para usar como disparadores en talleres y discusiones.",
    'Película Completa': "Aquí encontrarás películas completas que exploran narrativamente las implicaciones de la inteligencia artificial. Una oportunidad para ver cómo la ficción aborda los grandes temas de la IA.",
    'Filmoteca Esencial de Ficción': "El cine de ciencia ficción ha sido nuestro laboratorio de ideas, el espacio donde hemos imaginado y temido las posibilidades de la IA. Estas películas son cruciales para entender el imaginario cultural que hoy da forma a la tecnología que creamos."
};


export default function MoviesIAPage() {
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [selectedVideoTitle, setSelectedVideoTitle] = useState<string | null>(null);

    const [movieModalOpen, setMovieModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    
    const [cineclubModalOpen, setCineclubModalOpen] = useState(false);

    const cinemaImage = PlaceHolderImages.find(p => p.id === 'hero-bg-cinema-film');

    const handlePlayVideo = (video: YouTubeContent) => {
        setSelectedVideoId(video.videoId);
        setSelectedVideoTitle(video.title);
        setVideoModalOpen(true);
    };

    const handleShowMovieInfo = (movie: Movie) => {
        setSelectedMovie(movie);
        setMovieModalOpen(true);
    };

    return (
        <>
            <button
                onClick={() => setCineclubModalOpen(true)}
                className="fixed top-6 left-4 z-[60] ticket"
            >
                <div className="ticket-main">CINE CLUB</div>
                <div className="ticket-stub">ADMIT ONE</div>
            </button>
            <div className="relative h-64 md:h-96 w-full flex items-center justify-center text-center overflow-hidden">
                {cinemaImage && (
                    <Image
                        src={cinemaImage.imageUrl}
                        alt={cinemaImage.description}
                        fill
                        className="object-cover animate-zoom-in-out"
                        priority
                        data-ai-hint={cinemaImage.imageHint}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/80 z-10" />

                <div className="relative z-20 p-4">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold font-headline tracking-tighter sm:text-7xl highlight-bar">MOVIES IA 🎬</h1>
                        <p className="max-w-2xl text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-mono mt-4 bg-black/60 p-2">
                           Una filmoteca curada sobre inteligencia artificial, conciencia y los dilemas éticos de la tecnología, organizada para la exploración crítica.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container py-12 md:py-24">
                <div className="space-y-16 mb-20">
                     {categoryOrder.map(category => (
                        videoCategories[category] && (
                            <div key={category}>
                                <div className="max-w-3xl mb-8">
                                    <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl mb-4 flex items-center gap-4">
                                        <Youtube className="h-8 w-8 text-primary" />
                                        {category}
                                    </h2>
                                    {categoryDescriptions[category] && (
                                        <p className="text-muted-foreground font-mono">
                                            {categoryDescriptions[category]}
                                        </p>
                                    )}
                                </div>
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

                <Separator className="my-20" />

                <div>
                    <div className="max-w-3xl mb-8">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl mb-4 flex items-center gap-4">
                            <Film className="h-8 w-8 text-primary" />
                            Filmoteca Esencial de Ficción
                        </h2>
                        <p className="text-muted-foreground font-mono">
                            {categoryDescriptions['Filmoteca Esencial de Ficción']}
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {aiMovies.map((movie) => {
                            const image = PlaceHolderImages.find(p => p.id === movie.imageId);
                            return (
                                <Card key={movie.id} className="flex flex-col group overflow-hidden cursor-pointer" onClick={() => handleShowMovieInfo(movie)}>
                                    {image && (
                                        <div className="aspect-[2/3] overflow-hidden relative scanline-overlay">
                                            <Image
                                                alt={movie.title}
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                fill
                                                src={image.imageUrl}
                                                data-ai-hint={image.imageHint}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <PlayCircle className="h-16 w-16 text-white" />
                                            </div>
                                        </div>
                                    )}
                                    <CardHeader className="p-3">
                                        <CardTitle className="text-sm leading-tight !text-foreground">{movie.title}</CardTitle>
                                        <CardDescription className="text-xs">{movie.year}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-3 flex-grow">
                                        <p className="font-mono text-xs text-muted-foreground line-clamp-4">{movie.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            <VideoModal
                isOpen={videoModalOpen}
                setIsOpen={setVideoModalOpen}
                videoId={selectedVideoId}
                title={selectedVideoTitle}
            />

            <MovieInfoModal
                isOpen={movieModalOpen}
                setIsOpen={setMovieModalOpen}
                movie={selectedMovie}
            />

            <Dialog open={cineclubModalOpen} onOpenChange={setCineclubModalOpen}>
                <DialogContent className="max-w-4xl h-auto p-0 border-0 bg-black">
                    <DialogTitle className="sr-only">CINECLUB</DialogTitle>
                    <div className="aspect-video">
                        <iframe
                            src="//ok.ru/videoembed/2373589011067?nochat=1"
                            frameBorder="0"
                            allow="autoplay"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
