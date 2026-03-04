'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, increment } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader, Save, Sparkles, Lightbulb } from 'lucide-react';
import type { PlayIteration, PlayExperiment } from '@/types/play';
import { evaluateIteration } from '@/ai/flows/evaluate-iteration-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  version: z.string().min(1, { message: 'La versión es requerida. Ej: v0.2' }),
  changes: z.string().min(10, { message: 'Describe los cambios (mínimo 10 caracteres).' }),
  build_url: z.string().url({ message: 'Debe ser una URL válida.' }).optional().or(z.literal('')),
  feedback: z.string().optional(),
});

type CreateIterationFormProps = {
    experiment: PlayExperiment;
};

export function CreateIterationForm({ experiment }: CreateIterationFormProps) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: '',
      changes: '',
      build_url: '',
      feedback: '',
    },
  });

  async function getAIFeedback() {
    const changes = form.getValues("changes");
    if (!changes) {
      toast({
        variant: "destructive",
        title: "Describe tus cambios",
        description: "Para recibir feedback, primero describe qué cambios hiciste en esta versión.",
      });
      return;
    }

    setIsAiLoading(true);
    setAiFeedback(null);
    try {
      const result = await evaluateIteration({
        experimentTitle: experiment.title,
        experimentType: experiment.type,
        changes: changes,
      });
      setAiFeedback(result.feedback);
      form.setValue("feedback", result.feedback);
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      toast({
        variant: "destructive",
        title: "Error del Mentor IA",
        description: "No se pudo generar el feedback. Inténtalo de nuevo.",
      });
    } finally {
      setIsAiLoading(false);
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    
    setIsLoading(true);

    const newIteration: Omit<PlayIteration, 'id'> = {
      experimentId: experiment.id,
      version: values.version,
      changes: values.changes,
      build_url: values.build_url,
      feedback: values.feedback,
      createdAt: new Date().toISOString(),
    };

    try {
      const iterationsCollection = collection(firestore, 'play_iterations');
      addDocumentNonBlocking(iterationsCollection, newIteration);

      const experimentRef = doc(firestore, 'play_experiments', experiment.id);
      const experimentUpdateData: any = {
        iterations: increment(1)
      };
      
      if(values.build_url) {
        experimentUpdateData.build_url = values.build_url;
      }
      updateDocumentNonBlocking(experimentRef, experimentUpdateData);
      
      toast({
        title: '¡Nueva Iteración Guardada!',
        description: `La versión ${values.version} ha sido registrada.`,
      });
      form.reset();
      setAiFeedback(null);
      router.refresh();
    } catch (error) {
      console.error("Error creating iteration:", error);
      toast({
        variant: 'destructive',
        title: 'Error al crear la iteración',
        description: 'Hubo un problema al guardar. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
        <Card>
        <CardHeader>
            <CardTitle>Registrar Nueva Iteración</CardTitle>
            <CardDescription>
            Documenta el progreso de tu prototipo. Cada iteración es un paso en tu proceso creativo.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Versión</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: v0.2, v1.0.1..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="build_url"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>URL del Prototipo (Opcional)</FormLabel>
                        <FormControl>
                            <Input placeholder="https://tu-prototipo.vercel.app/" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                control={form.control}
                name="changes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Cambios Realizados</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Describe los cambios, mejoras o correcciones en esta versión."
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div className="flex justify-end">
                    <Button type="button" variant="ghost" onClick={getAIFeedback} disabled={isAiLoading}>
                        {isAiLoading ? <Loader className="mr-2 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Obtener Feedback de IA
                    </Button>
                </div>
                
                {aiFeedback && (
                    <Alert variant="default" className="border-accent/30 bg-accent/5">
                        <Lightbulb className="h-4 w-4 text-accent" />
                        <AlertTitle className="text-accent">Sugerencia del Mentor IA</AlertTitle>
                        <AlertDescription className="text-accent-foreground/90">
                            {aiFeedback}
                        </AlertDescription>
                    </Alert>
                )}

                <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Feedback o Notas (Opcional)</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Anota feedback recibido, ideas para el futuro, o cualquier otra reflexión sobre esta iteración."
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader className="mr-2 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Guardar Iteración
                    </Button>
                </div>
            </form>
            </Form>
        </CardContent>
        </Card>
    </section>
  );
}
