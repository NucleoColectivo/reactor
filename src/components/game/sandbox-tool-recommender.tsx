'use client';

import { useState } from 'react';
import { recomendarHerramientasIA, type RecomendarHerramientasIAOutput } from '@/ai/ai-tool-recommendations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Wand2, Lightbulb, ArrowUpRight, GraduationCap, Rocket, Baby, Compass, FlaskConical, Paintbrush } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from '../ui/label';
import Link from 'next/link';
import { Badge } from '../ui/badge';

const profiles = [
    { value: 'Creativo', label: 'Creativo', icon: <Paintbrush className="h-4 w-4" /> },
    { value: 'Investigador', label: 'Investigador', icon: <FlaskConical className="h-4 w-4" /> },
    { value: 'Emprendedor', label: 'Emprendedor', icon: <Lightbulb className="h-4 w-4" /> },
    { value: 'Explorador', label: 'Explorador', icon: <Compass className="h-4 w-4" /> },
];

export function SandboxToolRecommender() {
    const [level, setLevel] = useState('Básico');
    const [profile, setProfile] = useState('Creativo');
    const [progress, setProgress] = useState([50]);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<RecomendarHerramientasIAOutput | null>(null);
    const { toast } = useToast();

    const handleSubmit = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await recomendarHerramientasIA({ 
                learningModule: level, 
                progressPercentage: progress[0],
                userProfile: profile
            });
            setResult(response);
        } catch (error) {
            console.error('Error in tool recommendation flow:', error);
            toast({
                variant: "destructive",
                title: "Error al obtener recomendaciones",
                description: "No se pudieron generar las recomendaciones. Inténtalo de nuevo.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Recomendador de Herramientas 🛠️</CardTitle>
                    <CardDescription>Ajusta tu nivel y progreso para recibir recomendaciones de herramientas y recursos de IA, pensadas para tu proceso creativo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                        <div className='space-y-2'>
                            <Label htmlFor="level-select" className="flex items-center gap-2 font-semibold"><GraduationCap className="h-4 w-4" /> Tu Nivel Actual</Label>
                            <Select value={level} onValueChange={setLevel} disabled={isLoading}>
                                <SelectTrigger id="level-select" className="w-full">
                                    <SelectValue placeholder="Selecciona un nivel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Básico"><div className="flex items-center gap-2"><Baby className="h-4 w-4" /> Básico</div></SelectItem>
                                    <SelectItem value="Intermedio"><div className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Intermedio</div></SelectItem>
                                    <SelectItem value="Avanzado"><div className="flex items-center gap-2"><Rocket className="h-4 w-4" /> Avanzado</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="profile-select" className="flex items-center gap-2 font-semibold"><Compass className="h-4 w-4" /> Tu Perfil de Explorador</Label>
                            <Select value={profile} onValueChange={setProfile} disabled={isLoading}>
                                <SelectTrigger id="profile-select" className="w-full">
                                    <SelectValue placeholder="Selecciona un perfil" />
                                </SelectTrigger>
                                <SelectContent>
                                    {profiles.map(p => (
                                        <SelectItem key={p.value} value={p.value}>
                                            <div className="flex items-center gap-2">{p.icon} {p.label}</div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className='space-y-2 lg:col-span-3'>
                            <Label className="font-semibold">Tu Progreso en el Nivel ({progress[0]}%)</Label>
                            <Slider
                                value={progress}
                                onValueChange={setProgress}
                                max={100}
                                step={1}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={handleSubmit} disabled={isLoading} size="lg">
                        {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Obtener Recomendaciones
                    </Button>
                </CardFooter>
            </Card>

            {isLoading && (
                <div className="flex justify-center items-center p-8 text-center text-muted-foreground animate-pulse">
                    <Loader className="mr-4 h-8 w-8 animate-spin" />
                    <p>Buscando las herramientas perfectas para ti...</p>
                </div>
            )}

            {!isLoading && !result && (
                <Alert variant="default" className="border-dashed max-w-2xl mx-auto">
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>¿Cómo funciona?</AlertTitle>
                    <AlertDescription>
                        La IA analizará tu nivel y progreso para sugerirte de 2 a 3 herramientas o recursos que se alinean con la filosofía de Núcleo Colectivo: fomentar la experimentación y el pensamiento crítico.
                    </AlertDescription>
                </Alert>
            )}

            {result && (
                <div className="animate-in fade-in-50 space-y-4">
                     <h2 className="text-2xl font-bold font-headline text-center">Herramientas Recomendadas para ti 🧭</h2>
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {result.toolRecommendations.map((tool, index) => (
                             <Card key={index} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{tool.title}</CardTitle>
                                    <Badge variant="secondary" className="w-fit">{tool.category}</Badge>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                     <p className="text-sm text-muted-foreground">{tool.description}</p>
                                     <div className="p-3 bg-primary/5 rounded-md border-l-4 border-primary">
                                        <p className="text-sm font-semibold mb-1 text-primary">Razón para ti:</p>
                                        <p className="text-sm text-muted-foreground italic">"{tool.reason}"</p>
                                     </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href={tool.url} target="_blank" rel="noreferrer">
                                            Visitar
                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}