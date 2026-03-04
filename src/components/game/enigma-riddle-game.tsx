'use client';

import { useState, useEffect } from 'react';
import { generateEnigmaRiddle, type EnigmaRiddleOutput, type RiddleCategory } from '@/ai/flows/enigma-riddle-flow';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Wand2, Lightbulb, type LucideIcon, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

type EnigmaRiddleGameProps = {
    category: RiddleCategory;
    Icon: LucideIcon;
    description: string;
};

export function EnigmaRiddleGame({ category, Icon, description }: EnigmaRiddleGameProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [riddleData, setRiddleData] = useState<EnigmaRiddleOutput | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const { toast } = useToast();

    const fetchRiddle = async () => {
        setIsLoading(true);
        setRiddleData(null);
        setSelectedOption(null);
        setIsAnswered(false);

        try {
            const result = await generateEnigmaRiddle({ category });
            setRiddleData(result);
        } catch (error) {
            console.error(`Error generating ${category} riddle:`, error);
            toast({
                variant: "destructive",
                title: "Error al generar enigma",
                description: "No se pudo crear un nuevo acertijo. Inténtalo de nuevo.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectOption = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
    };
    
    useEffect(() => {
        fetchRiddle();
    }, []);

    const isCorrect = selectedOption === riddleData?.correctOptionIndex;

    return (
        <div className="w-full system-border p-6 flex flex-col">
            <header className="mb-4">
                <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-headline">{category}</h3>
                </div>
                <p className="text-muted-foreground text-sm mt-1 font-mono">{description}</p>
            </header>
            <div className="space-y-4 min-h-[250px] flex-grow">
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <div className="space-y-2">
                           <Skeleton className="h-10 w-full" />
                           <Skeleton className="h-10 w-full" />
                           <Skeleton className="h-10 w-full" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                )}

                {riddleData && !isLoading && (
                    <div className="space-y-4 animate-in fade-in-50">
                        <p className="text-lg text-foreground font-medium font-mono">{riddleData.riddle}</p>
                        <div className="space-y-2">
                            {riddleData.options.map((option, index) => {
                                const isSelected = selectedOption === index;
                                const isCorrectOption = index === riddleData.correctOptionIndex;

                                return (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className={cn(
                                            "w-full h-auto justify-start text-left py-3 whitespace-normal font-mono",
                                            isAnswered && isSelected && !isCorrect && "bg-destructive/20 border-destructive text-white",
                                            isAnswered && isCorrectOption && "bg-primary/20 border-primary text-white",
                                            !isAnswered && "hover:bg-secondary"
                                        )}
                                        onClick={() => handleSelectOption(index)}
                                        disabled={isAnswered}
                                    >
                                        <div className="flex items-center w-full">
                                            <span className="flex-1">{option}</span>
                                            {isAnswered && isSelected && isCorrect && <CheckCircle className="h-5 w-5 text-primary"/>}
                                            {isAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive"/>}
                                            {isAnswered && !isSelected && isCorrectOption && <CheckCircle className="h-5 w-5 text-primary/50"/>}
                                        </div>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {isAnswered && riddleData && (
                     <Alert variant={isCorrect ? "default" : "destructive"} className={cn("mt-4 animate-in fade-in-50 font-mono", isCorrect && "border-primary/50 bg-primary/10")}>
                         <Lightbulb className={cn("h-4 w-4", isCorrect && "text-primary")} />
                        <AlertTitle className="font-bold">{isCorrect ? "¡CORRECTO!" : "RESPUESTA INCORRECTA"}</AlertTitle>
                        <AlertDescription className="text-foreground/80">
                            {riddleData.explanation}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            <footer className="mt-6">
                 <Button onClick={fetchRiddle} disabled={isLoading} variant="secondary" className="w-full font-mono">
                    {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    GENERAR_NUEVO_ENIGMA
                </Button>
            </footer>
        </div>
    );
}
