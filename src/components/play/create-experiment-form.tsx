'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader, Wand2 } from 'lucide-react';
import type { PlayExperiment } from '@/types/play';

const formSchema = z.object({
  title: z.string().min(5, { message: 'El título debe tener al menos 5 caracteres.' }),
  type: z.enum(['juego', 'interaccion', 'videoarte', 'instalacion_simulada'], {
    required_error: 'Debes seleccionar un tipo de experimento.',
  }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }).max(500),
  tools: z.string().optional(),
  template: z.enum(['malla-sonica', 'tejido-audiovisual', 'vigilia', 'ninguno']).optional(),
});

export function CreateExperimentForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tools: '',
      template: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'No estás autenticado',
        description: 'Debes iniciar sesión para crear un prototipo.',
      });
      return;
    }
    
    setIsLoading(true);

    const toolsArray = values.tools?.split(',').map(tool => tool.trim()).filter(Boolean) || [];

    const newExperiment: Omit<PlayExperiment, 'id'> = {
      title: values.title,
      type: values.type,
      description: values.description,
      tools: toolsArray,
      authorId: user.uid,
      status: 'prototipo',
      iterations: 0,
      publishable: false,
      createdAt: new Date().toISOString(),
      concept: '',
      tags: [values.type],
      template: values.template === 'ninguno' ? undefined : values.template,
    };

    try {
      const experimentsCollection = collection(firestore, 'play_experiments');
      const docRef = await addDocumentNonBlocking(experimentsCollection, newExperiment);
      
      toast({
        title: '¡Prototipo creado!',
        description: 'Tu nuevo prototipo ha sido añadido a Kinefonía.',
      });
      
      if (docRef) {
        router.push(`/play/${docRef.id}`);
      } else {
        router.push('/play');
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating experiment:", error);
      toast({
        variant: 'destructive',
        title: 'Error al crear el prototipo',
        description: 'Hubo un problema al guardar tu prototipo. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo Prototipo</CardTitle>
        <CardDescription>
          Define la idea base para tu nuevo prototipo en KINEFONÍA. Recuerda: empieza simple, la iteración es la clave.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Prototipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juego de gravedad sonora" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Prototipo</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="juego">Juego</SelectItem>
                      <SelectItem value="interaccion">Interacción</SelectItem>
                      <SelectItem value="videoarte">Videoarte</SelectItem>
                      <SelectItem value="instalacion_simulada">Instalación Simulada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plantilla de Experimento (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una plantilla base..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ninguno">Ninguno (URL Externa)</SelectItem>
                      <SelectItem value="malla-sonica">Malla Sónica</SelectItem>
                      <SelectItem value="tejido-audiovisual">Tejido Audiovisual</SelectItem>
                      <SelectItem value="vigilia">Vigilia</SelectItem>
                    </SelectContent>
                  </Select>
                   <FormDescription>
                    Puedes empezar desde una de nuestras plantillas interactivas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Corta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe la idea central de tu experimento en una o dos frases."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tools"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Herramientas (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="p5.js, Unity, Three.js..." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>
                    Lista las herramientas principales que planeas usar, separadas por comas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader className="mr-2 animate-spin" /> : <Wand2 className="mr-2" />}
                    Iniciar Prototipo
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
