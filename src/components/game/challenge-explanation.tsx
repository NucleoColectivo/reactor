'use client';

import { useState } from 'react';
import { evaluateExplanation, type EvaluateExplanationOutput } from '@/ai/flows/evaluate-explanation-flow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Sparkles, MessageSquare, Lightbulb, Trophy, FolderKanban, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import type { Progress as UserProgress, CreativeProject } from '@/types/creative_work';
import { collection, query, where, doc } from 'firebase/firestore';
import Link from 'next/link';

type ChallengeExplanationProps = {
    concept: string;
    challengeDescription: string;
    routeId: string;
    moduleId: string;
};

export function ChallengeExplanation({ concept, challengeDescription, routeId, moduleId }: ChallengeExplanationProps) {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [project, setProject] = useState<CreativeProject | null>(null);
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const progressQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'progress'), where('userId', '==', user.uid), where('routeId', '==', routeId));
      }, [user, firestore, routeId]);
    
    const { data: progressData } = useCollection<UserProgress>(progressQuery);

    const handleSubmit = async () => {
        if (!explanation.trim() || !user) {
            if (!user) {
                toast({
                    variant: "destructive",
                    title: "Usuario no autenticado",
                    description: "Debes iniciar sesión para guardar tu progreso.",
                });
            }
            return;
        };
        
        setIsLoading(true);

        try {
            const evaluation = await evaluateExplanation({ concept, explanation });

            // After getting feedback, save progress and project
            if (user && firestore) {
                // 1. Update Progress
                const currentProgress = progressData?.[0];
                if (currentProgress) {
                    const progressRef = doc(firestore, 'progress', currentProgress.id);
                    const updatedExercises = [...new Set([...currentProgress.completedExercises, moduleId])];
                    updateDocumentNonBlocking(progressRef, {
                        completedExercises: updatedExercises,
                        updatedAt: new Date().toISOString()
                    });
                } else {
                    const newProgressRef = doc(collection(firestore, 'progress'));
                    const newProgress: UserProgress = {
                        id: newProgressRef.id,
                        userId: user.uid,
                        routeId: routeId,
                        completedModules: [],
                        completedExercises: [moduleId],
                        updatedAt: new Date().toISOString(),
                    };
                    setDocumentNonBlocking(newProgressRef, newProgress, { merge: false });
                }

                // 2. Create Creative Project
                const newProjectRef = doc(collection(firestore, 'projects_creativo'));
                const newProject: CreativeProject = {
                    id: newProjectRef.id,
                    userId: user.uid,
                    title: `Reflexión sobre: ${concept}`,
                    routeId: routeId,
                    description: evaluation.feedback,
                    status: 'completado',
                    outputs: {
                        text: explanation,
                    },
                    createdAt: new Date().toISOString(),
                };
                setDocumentNonBlocking(newProjectRef, newProject, { merge: false });
                
                setProject(newProject);
                
                toast({
                  title: "¡Reflexión Guardada! ✨",
                  description: "Tu ejercicio ha sido completado y añadido a tus proyectos personales en tu perfil.",
                });
            }
        } catch (error) {
            console.error('Error evaluating explanation:', error);
            toast({
                variant: "destructive",
                title: "Error en el diálogo",
                description: "No se pudo procesar tu reflexión. Inténtalo de nuevo.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (project) {
        return (
            <Card className="w-full max-w-2xl mx-auto animate-in fade-in-50">
                <CardHeader className="items-center text-center">
                    <Trophy className="h-16 w-16 text-yellow-400 mb-4" />
                    <CardTitle>¡Ejercicio Completado!</CardTitle>
                    <CardDescription>Tu reflexión se ha guardado como un nuevo proyecto creativo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-xl">{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <p className="text-sm font-semibold text-muted-foreground">Tu Reflexión</p>
                                <blockquote className="mt-1 border-l-2 pl-4 italic text-sm">"{project.outputs?.text}"</blockquote>
                            </div>
                             <div>
                                <p className="text-sm font-semibold text-muted-foreground">Feedback del Colaborador IA</p>
                                <blockquote className="mt-1 border-l-2 pl-4 italic text-sm">"{project.description}"</blockquote>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row justify-center gap-4">
                    <Button asChild>
                        <Link href="/profile">
                            <FolderKanban className="mr-2 h-4 w-4" />
                            Ver Mis Proyectos
                        </Link>
                    </Button>
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a la Ruta
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>🧠 Ejercicio: Explora "{concept}"</CardTitle>
                <CardDescription>{challengeDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder={`Con tus propias palabras, ¿qué significa para ti "${concept}"? No hay respuestas incorrectas al explorar...`}
                    disabled={isLoading}
                    rows={6}
                    className="text-base"
                />
                 {!isLoading && (
                     <Alert variant="default" className="border-dashed bg-accent/10 border-accent/30">
                        <Lightbulb className="h-5 w-5 text-accent" />
                        <AlertTitle className="font-bold text-accent">Sugerencia para Explorar</AlertTitle>
                        <AlertDescription>
                            No busques la definición de un libro. El objetivo es explorar tu comprensión actual del concepto. El proceso es el resultado.
                        </AlertDescription>
                    </Alert>
                 )}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isLoading || !explanation.trim()} size="lg">
                    {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Compartir Reflexión
                </Button>
            </CardFooter>
        </Card>
    );
}
