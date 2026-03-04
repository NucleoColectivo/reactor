'use client';

import { showcaseItems } from "@/lib/data";
import { ShowcaseCard } from "@/components/cards/showcase-card";
import { Radio } from "lucide-react";

export default function ArchivoPage() {
    return (
        <div className="container py-12 md:py-24">
            <div className="flex flex-col items-center space-y-4 mb-12 text-center">
                <div className="flex items-center justify-center gap-4">
                    <Radio className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl highlight-bar">[ VITRINA ]</h1>
                </div>
                 <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground font-mono">
                    Una selección curada de proyectos, procesos y experimentos de la comunidad. Exploraciones sonoras, visuales e interactivas.
                </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {showcaseItems.map((item, index) => (
                    <ShowcaseCard key={`${item.id}-${index}`} item={item} />
                ))}
            </div>
        </div>
    );
}
