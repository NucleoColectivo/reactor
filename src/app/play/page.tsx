'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Beaker, Gamepad2, Video, Code, PlusCircle, Cpu } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { PlayExperiment } from '@/types/play';
import { Skeleton } from '@/components/ui/skeleton';


const getExperimentProps = (exp: PlayExperiment) => {
    let icon = <Beaker className="w-5 h-5 text-primary" />;
    let imageId = 'lab-malla-sonica'; // a default
    let typeLabel = exp.type.replace('_', ' ');

    switch (exp.type) {
        case 'juego':
            icon = <Gamepad2 className="w-5 h-5 text-primary" />;
            typeLabel = 'Juego';
            break;
        case 'interaccion':
            icon = <Code className="w-5 h-5 text-primary" />;
            typeLabel = 'Interacción';
            break;
        case 'videoarte':
            icon = <Video className="w-5 h-5 text-primary" />;
            typeLabel = 'Videoarte';
            break;
        case 'instalacion_simulada':
            icon = <Beaker className="w-5 h-5 text-primary" />;
            typeLabel = 'Instalación Simulada';
            break;
    }
    
    if (exp.template === 'malla-sonica') imageId = 'lab-malla-sonica';
    if (exp.template === 'tejido-audiovisual') imageId = 'lab-tejido-audiovisual';
    if (exp.template === 'vigilia') imageId = 'lab-vigilia';

    return { icon, typeLabel, imageId };
};


export default function PlayPage() {
  const firestore = useFirestore();

  const experimentsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'play_experiments'), orderBy('createdAt', 'desc')) : null),
    [firestore]
  );
  
  const { data: experiments, isLoading } = useCollection<PlayExperiment>(experimentsQuery);

  return (
      <div className="container py-12 md:py-24">
        <div className="flex flex-col items-center space-y-4 mb-12 text-center">
          <div className="flex items-center gap-4">
              <Cpu className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl highlight-bar">[ KINEFONÍA ]</h1>
          </div>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground font-mono">
            Laboratorio de prototipos audiovisuales e interactivos. Aquí se crean, iteran y exhiben los experimentos de la comunidad.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Link href="/play/create" className="flex">
              <Card className="flex flex-col w-full items-center justify-center border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10 transition-all min-h-[350px]">
                  <CardHeader className="text-center items-center">
                      <PlusCircle className="h-12 w-12 text-primary/80 mb-4" />
                      <CardTitle className="text-2xl font-headline text-primary">Crear Nuevo Prototipo</CardTitle>
                      <CardDescription>Añade tu experimento a Kinefonía.</CardDescription>
                  </CardHeader>
              </Card>
          </Link>
          
          {isLoading && (
              Array.from({ length: 7 }).map((_, i) => (
                  <Card key={i} className="flex flex-col min-h-[350px]">
                      <Skeleton className="aspect-video" />
                      <CardHeader>
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full mt-2" />
                      </CardHeader>
                      <CardContent className="flex-grow">
                          <Skeleton className="h-4 w-1/4" />
                      </CardContent>
                      <CardFooter>
                          <Skeleton className="h-10 w-full" />
                      </CardFooter>
                  </Card>
              ))
          )}

          {experiments?.map((exp) => {
            const { icon, typeLabel, imageId } = getExperimentProps(exp);
            const image = PlaceHolderImages.find((p) => p.id === imageId);
            return (
              <Card key={exp.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-xl group">
                {image ? (
                  <div className="aspect-video overflow-hidden relative scanline-overlay">
                    <Image
                      alt={exp.title}
                      className="object-cover w-full h-full"
                      height={300}
                      src={image.imageUrl}
                      width={400}
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                        <Beaker className="w-10 h-10 text-muted-foreground" />
                    </div>
                )}
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle>{exp.title}</CardTitle>
                        <div className="bg-primary/10 text-primary p-2">
                            {icon}
                        </div>
                    </div>
                  <CardDescription>{exp.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{typeLabel}</span>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-mono">
                    <Link href={`/play/${exp.id}`}>
                      VER_PROTOTIPO
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
  );
}
