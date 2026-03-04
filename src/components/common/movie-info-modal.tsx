'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { Movie } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Users, BrainCircuit, HelpCircle, Video, BookOpen } from "lucide-react";

type MovieInfoModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    movie: Movie | null;
};

function InfoSection({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <div>
            <h3 className="font-headline text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-2">
                {icon}
                {title}
            </h3>
            {children}
        </div>
    )
}

export function MovieInfoModal({ isOpen, setIsOpen, movie }: MovieInfoModalProps) {
    if (!movie) return null;

    const image = PlaceHolderImages.find(p => p.id === movie.imageId);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-4xl p-0">
                <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-2 relative aspect-[2/3] md:aspect-auto md:min-h-[600px]">
                        {image && (
                            <Image
                                alt={movie.title}
                                className="object-cover rounded-l-lg"
                                fill
                                src={image.imageUrl}
                                data-ai-hint={image.imageHint}
                            />
                        )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    </div>
                    <div className="md:col-span-3 p-6 md:p-8 flex flex-col">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="font-headline text-3xl text-primary flex items-baseline gap-2">
                                {movie.title}
                                <span className="text-xl text-muted-foreground font-mono">({movie.year})</span>
                            </DialogTitle>
                            <DialogDescription className="font-mono text-sm !m-0">
                                Dirigida por <span className="font-semibold text-foreground">{movie.director}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 flex-grow">
                             <InfoSection icon={<BookOpen size={16}/>} title="Sinopsis">
                                <p className="text-base text-muted-foreground font-mono">{movie.description}</p>
                            </InfoSection>

                             <InfoSection icon={<Users size={16}/>} title="Actores Principales">
                                <div className="flex flex-wrap gap-2">
                                    {movie.actors.map(actor => (
                                        <Badge key={actor} variant="secondary">{actor}</Badge>
                                    ))}
                                </div>
                            </InfoSection>

                             <InfoSection icon={<BrainCircuit size={16} />} title="Reflexión IA">
                                <blockquote className="border-l-2 border-primary pl-4 text-base italic text-muted-foreground font-mono">
                                    {movie.aiReflection}
                                </blockquote>
                            </InfoSection>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t-2 border-dashed border-accent/20 bg-accent/5 p-4 rounded-md">
                             <InfoSection icon={<HelpCircle size={18} className="text-accent"/>} title="Pregunta Ética Central">
                                <p className="text-lg font-semibold text-accent-foreground font-mono mt-1">{movie.ethicalQuestion}</p>
                            </InfoSection>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
