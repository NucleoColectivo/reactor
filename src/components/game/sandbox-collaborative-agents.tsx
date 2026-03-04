'use client';

import { useState } from 'react';
import { runCollaborativeAgents, type AgentMessage } from '@/ai/flows/collaborative-agents-flow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Send, Wand2, SlidersHorizontal, FileText, Diamond } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

export function SandboxCollaborativeAgents() {
    const [task, setTask] = useState('Escribe una historia corta sobre un jardinero de asteroides.');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AgentMessage[] | null>(null);
    const { toast } = useToast();

    const plannerOutput = result?.find(m => m.agent === 'Planner')?.content;
    const executorOutput = result?.find(m => m.agent === 'Executor')?.content;

    const handleSubmit = async () => {
        if (!task.trim()) return;
        
        setIsLoading(true);
        setResult(null);

        try {
            const response = await runCollaborativeAgents({ task });
            setResult(response.dialogue);
        } catch (error) {
            console.error('Error in collaborative agents flow:', error);
            toast({
                variant: "destructive",
                title: "Error en la simulación",
                description: "No se pudo procesar la tarea. Inténtalo de nuevo.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex items-center gap-2">
                         <CardTitle className="text-2xl tracking-tighter uppercase leading-tight">Colaboración<br/>de Agentes</CardTitle>
                        <Diamond className="text-primary h-6 w-6 mt-2"/>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono mt-1 sm:mt-0 flex-1">
                        Define una tarea compleja y observa cómo dos IAs especializadas (un Planificador y un Ejecutor) colaboran para resolverla.
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                 <Alert variant="default" className="border-dashed">
                    <SlidersHorizontal className="h-4 w-4" />
                    <AlertTitle>¿Cómo funciona?</AlertTitle>
                    <AlertDescription>
                        Darás una instrucción de alto nivel. El agente "Planificador" creará una lista de pasos. Luego, el agente "Ejecutor" usará ese plan para generar el resultado final. Es una simulación de un sistema de agentes más complejo.
                    </AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <Label htmlFor="task-input" className="font-semibold font-mono">Tarea para los Agentes:</Label>
                    <Textarea
                        id="task-input"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Ej: Diseña un nuevo módulo de aprendizaje para Núcleo Colectivo sobre 'Arte y Sueños'..."
                        disabled={isLoading}
                        rows={3}
                        className="text-base font-mono"
                    />
                </div>
                
                <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-primary"/>
                            <h3 className="font-semibold text-lg font-headline flex items-center gap-2">
                                Agente Planificador <span className="text-xl">🧠</span>
                            </h3>
                        </div>
                        <div className={cn('p-4 rounded-md border bg-muted/30 min-h-[80px] text-sm text-foreground/90 whitespace-pre-wrap font-mono')}>
                            {isLoading && !result ? 'Pensando en un plan...' : (plannerOutput || 'No pude generar un plan.')}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Wand2 size={20} className="text-primary"/>
                            <h3 className="font-semibold text-lg font-headline flex items-center gap-2">
                                Agente Ejecutor <span className="text-2xl">🦾</span>
                            </h3>
                        </div>
                        <div className={cn('p-4 rounded-md border bg-muted/30 min-h-[120px] text-sm text-foreground/90 whitespace-pre-wrap font-mono')}>
                           {isLoading && result ? 'Ejecutando el plan...' : (executorOutput || 'No pude ejecutar el plan.')}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isLoading || !task.trim()} size="lg" className="font-mono">
                    {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Ejecutar Simulación
                </Button>
            </CardFooter>
        </Card>
    );
}
