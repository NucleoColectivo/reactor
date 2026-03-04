'use client';

import { useState } from 'react';
import { generateAudio } from '@/ai/flows/generate-audio-flow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Wand2, Music } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function SandboxAudio() {
  const [text, setText] = useState('Hola, mundo. Soy una voz generada por inteligencia artificial.');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateAudio = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setAudioUrl(null);

    try {
      const result = await generateAudio({ text });
      setAudioUrl(result.audioDataUri);
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        variant: "destructive",
        title: "Error al generar el audio",
        description: "Hubo un problema al contactar al modelo de IA. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Sandbox: Voz y Sonido con IA 🎤</CardTitle>
        <CardDescription>Experimenta con la creación de voz a partir de texto. Escribe un guion, una idea o un poema y escucha cómo la IA lo interpreta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-dashed min-h-[120px] p-4">
          {isLoading && <Loader className="h-12 w-12 animate-spin text-primary" />}
          {!isLoading && audioUrl && (
            <audio controls src={audioUrl} className="w-full animate-in fade-in-50">
              Tu navegador no soporta el elemento de audio.
            </audio>
          )}
           {!isLoading && !audioUrl && (
            <div className="text-center text-muted-foreground p-8">
                <Music className="h-12 w-12 mx-auto mb-2" />
                <p>El estudio de sonido está listo. ¿Qué quieres decir?</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe el texto que quieres convertir en audio..."
          disabled={isLoading}
          className="min-h-[60px] sm:min-h-0 text-base"
          rows={3}
        />
        <Button onClick={handleGenerateAudio} disabled={isLoading || !text.trim()} className="sm:w-auto" size="lg">
          {isLoading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generar Audio
        </Button>
      </CardFooter>
    </Card>
  );
}
