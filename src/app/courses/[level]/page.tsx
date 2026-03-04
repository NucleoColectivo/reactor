'use client';

import { coursePaths } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Gamepad2, ListChecks, MessageSquare, Puzzle, Clock, Star, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Progress } from '@/types/creative_work';

const StarRating = ({ rating, className }: { rating: number, className?: string }) => {
    const totalStars = 5;
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {Array.from({ length: totalStars }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
    );
};

export default function CourseLevelPage() {
    const params = useParams();
    const level = Array.isArray(params.level) ? params.level[0] : params.level;
    const course = coursePaths.find(p => level && p.level.toLowerCase() === level);

    const { user } = useUser();
    const firestore = useFirestore();

    const progressQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        const routeId = course?.level.toLowerCase();
        if (!routeId) return null;
        return query(collection(firestore, 'progress'), where('userId', '==', user.uid), where('routeId', '==', routeId));
      }, [user, firestore, course]);

    const { data: progressData, isLoading: isProgressLoading } = useCollection<Progress>(progressQuery);

    if (!course) {
        notFound();
    }

    const getGameIcon = (gameType: string) => {
        switch (gameType) {
            case 'Exploration':
                return <ListChecks className="h-5 w-5 text-primary" />;
            case 'Challenge':
                return <Puzzle className="h-5 w-5 text-primary" />;
            case 'Sandbox':
                return <MessageSquare className="h-5 w-5 text-primary" />;
            default:
                return null;
        }
    }

    return (
        <TooltipProvider>
            <div className="container py-12 md:py-24">
                <div className="mb-12 space-y-4">
                     <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-primary">
                        <Link href="/courses">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            VOLVER_A_RUTAS
                        </Link>
                    </Button>
                    <h1 className="text-5xl font-bold font-headline tracking-tighter sm:text-7xl">{course.spanishLevel}: {course.title}</h1>
                    <p className="max-w-[700px] text-lg text-muted-foreground font-mono">{course.description}</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {course.modules.map((module) => {
                        const image = PlaceHolderImages.find(p => p.id === module.imageId);
                        const isCompleted = user && !isProgressLoading && (
                            progressData?.[0]?.completedModules?.includes(module.id) || 
                            progressData?.[0]?.completedExercises?.includes(module.id)
                        );
                        
                        return (
                            <Card key={module.id} className={cn("flex flex-col group system-border", isCompleted && "border-primary/30")}>
                                {image && (
                                    <div className="aspect-video overflow-hidden relative scanline-overlay">
                                        <Image
                                            alt={module.title}
                                            className={cn("object-cover w-full h-full transition-transform duration-300 group-hover:scale-105", isCompleted && "grayscale opacity-60")}
                                            height={300}
                                            src={image.imageUrl}
                                            width={400}
                                            data-ai-hint={image.imageHint}
                                        />
                                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm p-1.5">
                                            {getGameIcon(module.gameType)}
                                        </div>
                                         {isCompleted && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                <CheckCircle className="h-16 w-16 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex-1">
                                      <CardTitle>{module.title}</CardTitle>
                                      <CardDescription>{module.subtitle}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3 font-mono" dangerouslySetInnerHTML={{ __html: module.description.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground/90 font-bold">$1</strong>') }} />
                                </CardContent>
                                <CardFooter className="flex-col items-stretch gap-4">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono pt-4 border-t-2 border-foreground/10">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{module.duration}</span>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="cursor-help">
                                                    <StarRating rating={module.rating} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Complejidad del módulo</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <Button asChild className="w-full font-mono" variant={isCompleted ? 'secondary' : 'default'}>
                                        <Link href={`/courses/${course.level.toLowerCase()}/${module.id}`}>
                                            <span className="text-sm uppercase tracking-wider font-bold">
                                                {isCompleted ? "REVISAR" : "EXPLORAR"}
                                            </span>
                                            <Gamepad2 className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </TooltipProvider>
    );
}
