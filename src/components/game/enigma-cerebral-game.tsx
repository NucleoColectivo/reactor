'use client';

import { useState, useMemo } from 'react';
import { generateEnigmaRiddle, type EnigmaRiddleOutput, type RiddleCategory } from '@/ai/flows/enigma-riddle-flow';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Loader, ArrowLeft, Puzzle, Palette, BookOpen, BrainCircuit, Eye, Lock, Check, X, Trophy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { AnimatePresence, motion } from "framer-motion";

const categories: { [key in RiddleCategory]: { regions: string[]; Icon: React.ElementType; color: string; bg: string; border: string; } } = {
    'Lógica y Razonamiento': { regions: ['Córtex Lógico', 'Nodo Deductivo', 'Puente Racional'], Icon: Puzzle, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30' },
    'Arte y Creatividad': { regions: ['Valle Creativo', 'Nexo Visual', 'Galería Abstracta'], Icon: Palette, color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/30' },
    'Literatura y Lenguaje': { regions: ['Ágora Verbal', 'Biblioteca Narrativa', 'Río Semántico'], Icon: BookOpen, color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30' },
    'Memoria y Conocimiento': { regions: ['Archivo Temporal', 'Palacio Mnemónico', 'Núcleo Asociativo'], Icon: BrainCircuit, color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30' },
    'Percepción y Atención': { regions: ['Observatorio Atencional', 'Detector de Anomalías', 'Foco Cenital'], Icon: Eye, color: 'text-pink-400', bg: 'bg-pink-900/20', border: 'border-pink-500/30' }
};
const categoryNames = Object.keys(categories) as RiddleCategory[];

type RegionStatus = 'neutral' | 'player' | 'ai';
type BoardState = { [regionName: string]: RegionStatus };
type GameState = 'map' | 'loading' | 'riddle' | 'result';

export function EnigmaCerebralGame() {
    const [board, setBoard] = useState<BoardState>(() => {
        const initialState: BoardState = {};
        Object.values(categories).flatMap(cat => cat.regions).forEach(r => initialState[r] = 'neutral');
        return initialState;
    });

    const [gameState, setGameState] = useState<GameState>('map');
    const [currentRegion, setCurrentRegion] = useState<{ name: string; category: RiddleCategory } | null>(null);
    const [riddleData, setRiddleData] = useState<EnigmaRiddleOutput | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    
    const { toast } = useToast();

    const score = useMemo(() => Object.values(board).filter(s => s === 'player').length, [board]);
    const totalRegions = useMemo(() => Object.values(categories).flatMap(c => c.regions).length, []);

    const handleRegionClick = async (region: string, category: RiddleCategory) => {
        if (board[region] !== 'neutral') return;
        
        setCurrentRegion({ name: region, category });
        setGameState('loading');

        try {
            const result = await generateEnigmaRiddle({ category });
            setRiddleData(result);
            setGameState('riddle');
        } catch (error) {
            console.error(`Error generating ${category} riddle:`, error);
            toast({
                variant: "destructive",
                title: "Error al generar enigma",
                description: "No se pudo crear un nuevo acertijo. Vuelve a intentarlo.",
            });
            setGameState('map');
        }
    };

    const handleAnswer = (optionIndex: number) => {
        if (!riddleData) return;
        setSelectedOption(optionIndex);
        setGameState('result');

        if (optionIndex === riddleData.correctOptionIndex) {
            setBoard(prev => ({...prev, [currentRegion!.name]: 'player' }));
        } else {
             setBoard(prev => ({...prev, [currentRegion!.name]: 'ai' }));
        }
    }

    const handleContinue = () => {
        setGameState('map');
        setCurrentRegion(null);
        setRiddleData(null);
        setSelectedOption(null);
    }
    
    if (score === totalRegions) {
        return (
            <Card className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center p-8">
                <Trophy className="h-24 w-24 text-yellow-400 mb-4" />
                <CardTitle className="text-3xl font-headline mb-2">¡Mapa Cerebral Completado!</CardTitle>
                <CardDescription className="text-lg mb-6">
                    Has iluminado todas las regiones del mapa. ¡Felicidades, Maestro de Enigmas!
                </CardDescription>
                <Button onClick={() => setBoard(Object.fromEntries(Object.keys(board).map(k => [k, 'neutral'])))} size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Jugar de Nuevo
                </Button>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-5xl mx-auto system-border p-0 overflow-hidden">
            <CardHeader className="border-b-2 border-foreground/10">
                <div className="flex justify-between items-center">
                    <CardTitle>Mapa Cerebral Interactivo</CardTitle>
                    <div className="font-mono text-sm">
                        <span>PUNTAJE: <span className="font-bold text-primary">{score}</span></span>
                        <span className="mx-2 text-muted-foreground">/</span>
                        <span>REGIONES: <span className="font-bold">{totalRegions}</span></span>
                    </div>
                </div>
                <CardDescription>Selecciona una región del cerebro para resolver un enigma y activarla.</CardDescription>
                <Progress value={(score / totalRegions) * 100} className="w-full mt-2" />
            </CardHeader>
            <CardContent className="p-4 md:p-6 relative min-h-[500px]">
                <AnimatePresence mode="wait">
                    {gameState === 'map' && (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4"
                        >
                            {categoryNames.map(catName => {
                                const category = categories[catName];
                                return (
                                <div key={catName} className={cn("rounded-md p-3 space-y-3", category.bg, category.border)}>
                                    <h3 className={cn("font-headline text-sm flex items-center gap-2", category.color)}>
                                        <category.Icon className="w-5 h-5"/> {catName}
                                    </h3>
                                    <div className="space-y-2">
                                        {category.regions.map(regionName => {
                                            const status = board[regionName];
                                            return (
                                                <Button
                                                    key={regionName}
                                                    variant="secondary"
                                                    onClick={() => handleRegionClick(regionName, catName)}
                                                    disabled={status !== 'neutral'}
                                                    className={cn("w-full justify-start h-auto text-left py-2 font-mono text-xs",
                                                        status === 'player' && 'bg-primary/20 border-primary text-white',
                                                        status === 'ai' && 'bg-destructive/20 border-destructive text-white'
                                                    )}
                                                >
                                                    {status === 'neutral' ? <Lock className="w-3 h-3 mr-2 opacity-50"/> : status === 'player' ? <Check className="w-3 h-3 mr-2 text-primary"/> : <X className="w-3 h-3 mr-2 text-destructive"/>}
                                                    {regionName}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )})}
                        </motion.div>
                    )}

                    {(gameState === 'riddle' || gameState === 'loading' || gameState === 'result') && currentRegion && (
                        <motion.div
                             key="riddle"
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -20 }}
                             className="absolute inset-0 bg-background p-6 flex flex-col items-center justify-center"
                        >
                            <div className="w-full max-w-2xl">
                                {gameState === 'loading' && <Loader className="w-12 h-12 text-primary animate-spin mx-auto"/>}

                                {gameState === 'riddle' && riddleData && (
                                    <>
                                        <h2 className="text-xl font-headline text-center mb-2 text-primary">{currentRegion.name}</h2>
                                        <p className="text-center text-muted-foreground mb-6 font-mono">{riddleData.riddle}</p>
                                        <RadioGroup onValueChange={(val) => handleAnswer(parseInt(val))} className="space-y-2">
                                            {riddleData.options.map((option, index) => (
                                                <Label key={index} htmlFor={`option-${index}`} className="flex items-start space-x-4 p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
                                                    <RadioGroupItem value={String(index)} id={`option-${index}`} className="mt-1"/>
                                                    <span className="flex-1 text-base font-mono">{option}</span>
                                                </Label>
                                            ))}
                                        </RadioGroup>
                                    </>
                                )}

                                {gameState === 'result' && riddleData && selectedOption !== null && (
                                    <div className="text-center animate-in fade-in-50">
                                        <h2 className="text-xl font-headline mb-2 text-primary">{currentRegion.name}</h2>
                                        <p className="text-center text-muted-foreground mb-4 font-mono">{riddleData.riddle}</p>
                                        <p className={cn("text-3xl font-bold mb-4", selectedOption === riddleData.correctOptionIndex ? "text-primary" : "text-destructive")}>
                                            {selectedOption === riddleData.correctOptionIndex ? "¡CORRECTO!" : "INCORRECTO"}
                                        </p>
                                        <Alert variant={selectedOption === riddleData.correctOptionIndex ? "default" : "destructive"} className={cn("font-mono", selectedOption === riddleData.correctOptionIndex && "border-primary/50 bg-primary/10")}>
                                            <AlertDescription className="text-foreground/80">
                                                {riddleData.explanation}
                                            </AlertDescription>
                                        </Alert>
                                        <Button onClick={handleContinue} className="mt-8 font-mono">
                                            VOLVER_AL_MAPA
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
