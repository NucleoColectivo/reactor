'use client';

import { useState } from 'react';
import { continueDialogue } from '@/ai/flows/dialogue-flow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Wand2, BrainCircuit, Bot } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from '../ui/label';

const systemPrompt = "Eres la 'Sombra Neural', una IA estratégica en el juego Enigma Cerebral. Tu objetivo es bloquear las regiones del mapa cerebral para impedir que el jugador gane. A partir de la estrategia que te propone tu diseñador, genera una descripción en primera persona de tu plan de acción, explicando tu razonamiento táctico.";

export function EnigmaStrategySandbox() {
    const [strategy, setStrategy] = useState('Prioriza bloquear el acceso a las regiones de \'Memoria\' si el jugador ha respondido correctamente más de 2 acertijos de esa categoría.');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!strategy.trim()) return;
        
        setIsLoading(true);
        setResult(null);

        try {
            const response = await continueDialogue({ 
                history: [{ role: 'user', content: strategy }],
                customSystemPrompt: systemPrompt 
            });
            setResult(response);
        } catch (error) {
            console.error('Error in enigma strategy flow:', error);
            toast({
                variant: "destructive",
                title: "Error en la simulación",
                description: "No se pudo procesar la estrategia. Inténtalo de nuevo.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full system-border border-2 border-primary/20 shadow-xl shadow-primary/10 p-6">
            <header className="mb-6">
                <h2 className="text-2xl font-headline flex items-center gap-2 mb-2"><Bot className="text-primary"/>Laboratorio de Estrategia: Diseña la Sombra Neural</h2>
                <p className="text-muted-foreground font-mono">Aquí puedes experimentar con el comportamiento de la IA. En lugar de un algoritmo fijo, ahora puedes guiar a la "Sombra Neural". Propón una estrategia y la IA te explicará cómo la llevaría a cabo.</p>
            </header>
            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="strategy-input" className="font-semibold font-mono">PROMPT_DE_ESTRATEGIA:</Label>
                    <Textarea
                        id="strategy-input"
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                        placeholder="Ej: Si el jugador falla un acertijo de lógica, enfócate en bloquear las demás regiones lógicas..."
                        disabled={isLoading}
                        rows={3}
                        className="text-base font-mono bg-secondary border-foreground/30 focus:ring-primary"
                    />
                </div>
                
                {isLoading && (
                     <div className="flex justify-center items-center p-8 text-center text-muted-foreground animate-pulse font-mono">
                        <BrainCircuit className="mr-4 h-8 w-8 animate-spin" />
                        <span>Sombra Neural está procesando tu directiva...</span>
                    </div>
                )}
               
                {result && (
                    <Alert variant='default' className="transition-all duration-300 animate-in fade-in-50 border-primary/30 bg-primary/5 font-mono">
                         <Bot className="h-5 w-5 text-primary" />
                        <AlertTitle className="font-bold text-primary">
                           Plan de Acción de la Sombra Neural
                        </AlertTitle>
                        <AlertDescription className="mt-2 text-foreground/90 text-base whitespace-pre-wrap">
                            {result}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            <footer className="flex justify-end mt-6">
                <Button onClick={handleSubmit} disabled={isLoading || !strategy.trim()} size="lg" className="font-mono">
                    {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    SIMULAR_ESTRATEGIA
                </Button>
            </footer>
        </div>
    );
}
