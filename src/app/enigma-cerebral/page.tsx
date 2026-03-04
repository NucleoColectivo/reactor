'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
    BrainCircuit, 
    Puzzle, 
    Palette, 
    BookOpen, 
    Eye, 
    Lightbulb,
    Layers,
    Bot,
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";
import { EnigmaStrategySandbox } from "@/components/game/enigma-strategy-sandbox";
import { EnigmaCerebralGame } from "@/components/game/enigma-cerebral-game";
import { NucleoLogo } from "@/components/icons/nucleo-logo";

export default function EnigmaCerebralPage() {
    const heroImage = PlaceHolderImages.find(p => p.id === 'enigma-hero');
    const mapImage = PlaceHolderImages.find(p => p.id === 'enigma-map');

    return (
        <div className="container relative py-12 md:py-24">
            {heroImage && (
                <div className="relative w-full h-64 md:h-96 overflow-hidden mb-12">
                     <Image
                        alt="Enigma Cerebral"
                        src={heroImage.imageUrl}
                        fill
                        className="object-cover"
                        data-ai-hint={heroImage.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8">
                        <div className="flex items-center gap-6">
                            <div>
                                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                                    Enigma Cerebral
                                </h1>
                                <p className="max-w-2xl text-lg text-white/90 mt-2 font-mono">Un juego de trivia adaptativo con IA generativa para Núcleo Colectivo</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto space-y-24">
                
                <section className="max-w-4xl mx-auto system-border p-6">
                    <h2 className="text-2xl font-headline flex items-center gap-2 mb-4"><Lightbulb className="text-primary"/>Concepto del Juego</h2>
                    <div className="space-y-4 text-muted-foreground font-mono">
                        <p className="text-lg"><strong>Enigma Cerebral</strong> es un juego de trivia adaptativo que combina acertijos de lógica, arte, literatura, memoria y percepción con un sistema de inteligencia artificial generativa. El juego está diseñado para fomentar el desarrollo de diversas áreas cerebrales mientras ofrece una experiencia lúdica y educativa.</p>
                        <p>El juego presenta un <strong>Mapa Cerebral Interactivo</strong> donde el jugador "ilumina" regiones al resolver acertijos, mientras una <strong>Sombra Neural</strong> (un oponente de IA) compite bloqueando regiones estratégicas, con un comportamiento guiado por el jugador.</p>
                         <Separator className="my-4"/>
                        <p className="text-sm">Enigma Cerebral se alinea con nuestra misión al integrar arte-tecnología, ofrecer educación accesible y fomentar una comunidad participativa. Puede implementarse como una <strong>versión web</strong> en la plataforma, una <strong>instalación interactiva</strong> en espacios culturales, o como base para un <strong>taller participativo</strong>.</p>
                    </div>
                </section>

                <section>
                    <EnigmaCerebralGame />
                </section>
                
                <section className="max-w-4xl mx-auto">
                     <EnigmaStrategySandbox />
                </section>
                
                <section className="max-w-4xl mx-auto system-border p-6">
                    <h2 className="text-2xl font-headline flex items-center gap-2 mb-4"><Layers className="text-primary"/>Estructura y Mecánicas</h2>
                    <div className="space-y-6 font-mono">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">El Mapa Cerebral</h3>
                            <p className="text-muted-foreground mb-4">El juego se desarrolla en un mapa estilizado con 15 regiones en 5 categorías:</p>
                            {mapImage && <div className="relative w-full aspect-video overflow-hidden my-4 border border-foreground/20">
                                <Image src={mapImage.imageUrl} alt="Mapa Cerebral" fill className="object-cover" data-ai-hint={mapImage.imageHint}/>
                            </div>}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-start gap-2"><Puzzle size={16} className="text-primary mt-1 shrink-0"/><span><strong>Lógica y Razonamiento:</strong> Córtex Lógico, Nodo Deductivo.</span></div>
                                <div className="flex items-start gap-2"><Palette size={16} className="text-primary mt-1 shrink-0"/><span><strong>Arte y Creatividad:</strong> Valle Creativo, Nexo Visual.</span></div>
                                <div className="flex items-start gap-2"><BookOpen size={16} className="text-primary mt-1 shrink-0"/><span><strong>Literatura y Lenguaje:</strong> Ágora Verbal, Biblioteca Narrativa.</span></div>
                                <div className="flex items-start gap-2"><BrainCircuit size={16} className="text-primary mt-1 shrink-0"/><span><strong>Memoria y Conocimiento:</strong> Archivo Temporal, Núcleo Asociativo.</span></div>
                                <div className="flex items-start gap-2"><Eye size={16} className="text-primary mt-1 shrink-0"/><span><strong>Percepción y Atención:</strong> Observatorio Atencional, Detector de Anomalías.</span></div>
                            </div>
                        </div>
                        <Separator/>
                         <div>
                            <h3 className="font-semibold text-lg mb-2">Dinámica de Juego</h3>
                            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                <li><strong>Selección de Región:</strong> El jugador elige una región disponible.</li>
                                <li><strong>Presentación del Acertijo:</strong> Se muestra un acertijo correspondiente a la categoría.</li>
                                <li><strong>Resolución:</strong> El jugador intenta resolverlo, con opción a pistas.</li>
                                <li><strong>Turno de la Sombra Neural:</strong> La IA, guiada por la estrategia definida, bloquea una región.</li>
                                <li><strong>Progresión:</strong> El juego continúa hasta que todas las regiones están iluminadas o bloqueadas.</li>
                            </ol>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      );
}
