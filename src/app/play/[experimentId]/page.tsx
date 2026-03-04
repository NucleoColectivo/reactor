'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, useCollection, useUser, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from "@/hooks/use-toast";
import { doc, collection, query, where } from 'firebase/firestore';
import type { PlayExperiment, PlayIteration } from '@/types/play';
import { Loader, Beaker, Gamepad2, Video, Code, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreateIterationForm } from '@/components/play/create-iteration-form';
import { MallaSonica } from '@/components/lab/malla-sonica';
import { TejidoAudiovisual } from '@/components/lab/tejido-audiovisual';
import { VigiliaExperiment } from '@/components/lab/vigilia';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const getExperimentIcon = (type: string) => {
    switch (type) {
        case 'juego': return <Gamepad2 className="w-5 h-5 text-primary" />;
        case 'interaccion': return <Code className="w-5 h-5 text-primary" />;
        case 'videoarte': return <Video className="w-5 h-5 text-primary" />;
        case 'instalacion_simulada': return <Beaker className="w-5 h-5 text-primary" />;
        default: return <Beaker className="w-5 h-5 text-primary" />;
    }
};

export default function ExperimentDetailPage() {
    const params = useParams();
    const experimentId = params.experimentId as string;
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();

    const experimentRef = useMemoFirebase(
        () => (firestore && experimentId ? doc(firestore, 'play_experiments', experimentId) : null),
        [firestore, experimentId]
    );

    const { data: experiment, isLoading: isExperimentLoading } = useDoc<PlayExperiment>(experimentRef);
    
    const iterationsQuery = useMemoFirebase(() => {
        if (!firestore || !experimentId) return null;
        return query(collection(firestore, 'play_iterations'), where('experimentId', '==', experimentId));
    }, [firestore, experimentId]);

    const { data: iterations, isLoading: areIterationsLoading } = useCollection<PlayIteration>(iterationsQuery);
    
    const isAuthor = user && experiment && user.uid === experiment.authorId;

    const handlePublishableChange = (isPublishable: boolean) => {
        if (!experimentRef) return;
        updateDocumentNonBlocking(experimentRef, { publishable: isPublishable });
        toast({
            title: isPublishable ? "Listo para la Vitrina" : "Ya no está listo para la vitrina",
            description: "Has actualizado el estado de tu experimento.",
        });
    };

    const isLoading = isExperimentLoading || areIterationsLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="h-12 w-12 animate-spin" />
            </div>
        );
    }

    if (!experiment) {
        return (
            <div className="container py-12 md:py-24 text-center">
                <h1 className="text-2xl font-bold">Experimento no encontrado</h1>
                <p className="text-muted-foreground">El prototipo que buscas no existe o fue eliminado.</p>
                 <Button asChild variant="link" className="mt-4">
                    <Link href="/play">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a KINEFONÍA
                    </Link>
                </Button>
            </div>
        );
    }
    
    const renderExperiment = () => {
        if (experiment?.template === 'malla-sonica') {
            return <MallaSonica />;
        }
        if (experiment?.template === 'tejido-audiovisual') {
            return <TejidoAudiovisual />;
        }
        if (experiment?.template === 'vigilia') {
            return <VigiliaExperiment />;
        }
        
        // Fallback to iframe
        if (experiment?.build_url) {
            return (
                <Card className="h-[600px]">
                    <CardHeader>
                        <CardTitle>Visor del Prototipo (URL Externa)</CardTitle>
                        <CardDescription>Versión: {iterations?.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.version || 'v0.1'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <iframe
                            src={experiment.build_url}
                            className="w-full h-[480px] border bg-muted"
                            title={experiment.title}
                            allow="fullscreen"
                        />
                    </CardContent>
                </Card>
            );
        }

        // Placeholder if no template and no url
        return (
            <Card className="h-[600px] flex flex-col items-center justify-center border-dashed">
                <CardHeader className="text-center">
                    <CardTitle>Prototipo sin Contenido Visual</CardTitle>
                    <CardDescription>Este experimento no tiene una plantilla o URL externa asignada.</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground">Selecciona una plantilla o añade una URL a una iteración para visualizarlo aquí.</p>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="container py-12 md:py-24 space-y-12">
            <div>
                 <Button asChild variant="ghost">
                    <Link href="/play">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a KINEFONÍA
                    </Link>
                </Button>
            </div>
            
            <section className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    {renderExperiment()}
                </div>

                <aside className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-2xl font-headline">{experiment.title}</CardTitle>
                                <div className="bg-primary/10 text-primary p-2">
                                    {getExperimentIcon(experiment.type)}
                                </div>
                            </div>
                            <CardDescription>
                                Un prototipo de <span className="font-semibold capitalize">{experiment.type.replace('_', ' ')}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground text-sm">{experiment.description}</p>
                            <div>
                                <h4 className="font-semibold text-xs uppercase text-muted-foreground mb-2">Herramientas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {experiment.tools?.map(tool => <Badge key={tool} variant="secondary">{tool}</Badge>)}
                                    {(!experiment.tools || experiment.tools.length === 0) && <p className="text-xs text-muted-foreground italic">No definidas.</p>}
                                </div>
                            </div>
                            {isAuthor && (
                                <div className="border-t border-primary/20 pt-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="publishable-switch" className="font-semibold text-sm">¿Listo para la Vitrina?</Label>
                                        <Switch
                                            id="publishable-switch"
                                            checked={experiment.publishable}
                                            onCheckedChange={handlePublishableChange}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Activa esto cuando consideres que tu prototipo está listo para ser evaluado para la Vitrina pública.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                     
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Iteraciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {iterations && iterations.length > 0 ? (
                                <ul className="space-y-4">
                                    {iterations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(iter => (
                                        <li key={iter.id} className="border-l-2 border-primary/30 pl-4">
                                            <div className="flex justify-between items-center">
                                                <Badge variant="secondary">{iter.version}</Badge>
                                                <p className="text-xs text-muted-foreground">{new Date(iter.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-sm mt-2 text-muted-foreground">{iter.changes}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">Aún no se han registrado iteraciones para este prototipo.</p>
                            )}
                        </CardContent>
                    </Card>
                </aside>
            </section>
            
            {isAuthor && <CreateIterationForm experiment={experiment} />}
        </div>
    );
}
    
