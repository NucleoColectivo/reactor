'use client';

import { useState } from 'react';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Sparkles, ImageIcon, Download, Lightbulb, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const styles = [
    { value: "Fotografía artística", label: "Fotografía" },
    { value: "Arte digital", label: "Arte Digital" },
    { value: "Pintura al óleo", label: "Pintura al Óleo" },
    { value: "Estilo cinematográfico", label: "Cinematográfico" },
    { value: "Concept art", label: "Concept Art" },
    { value: "Blanco y negro", label: "Blanco y Negro" },
    { value: "Anime", label: "Anime" },
    { value: "Arte abstracto", label: "Abstracto" },
];

const aspectRatios = [
    { value: "1:1", label: "1:1 (Cuadrado)" },
    { value: "16:9", label: "16:9 (Panorámico)" },
    { value: "9:16", label: "9:16 (Vertical)" },
    { value: "4:3", label: "4:3 (Clásico)" },
];

export function SandboxImage() {
  const [prompt, setPrompt] = useState('Un gato astronauta flotando en el espacio');
  const [style, setStyle] = useState(styles[0].value);
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setImageUrl(null);

    try {
      const result = await generateImage({ prompt, style, aspectRatio });
      setImageUrl(result.imageDataUri);
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        variant: "destructive",
        title: "Error al generar la imagen",
        description: "Hubo un problema al contactar al modelo de IA. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `nucleo-creativo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
        title: "Imagen descargada",
        description: "La creación se ha guardado en tu dispositivo."
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Sandbox: Generador Visual 🎨</CardTitle>
        <CardDescription>Experimenta con la creación de imágenes a partir de texto. Describe una escena, combina estilos y parámetros, y observa cómo la IA la interpreta.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="prompt-input">1. Describe tu visión</Label>
                <Textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Un astronauta montando a caballo en Marte..."
                    disabled={isLoading}
                    rows={5}
                    className="text-base"
                />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="style-select">2. Elige un Estilo</Label>
                    <Select value={style} onValueChange={setStyle} disabled={isLoading}>
                        <SelectTrigger id="style-select">
                            <SelectValue placeholder="Estilo..." />
                        </SelectTrigger>
                        <SelectContent>
                            {styles.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="aspect-ratio-select">3. Define el Formato</Label>
                     <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isLoading}>
                        <SelectTrigger id="aspect-ratio-select">
                            <SelectValue placeholder="Aspecto..." />
                        </SelectTrigger>
                        <SelectContent>
                            {aspectRatios.map(ar => <SelectItem key={ar.value} value={ar.value}>{ar.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <Alert variant="default" className="border-dashed">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Sugerencias para el Prompt</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc list-inside text-xs space-y-1 mt-2">
                        <li><strong>Adjetivos:</strong> 'Surrealista', 'minimalista', 'hiperrealista'.</li>
                        <li><strong>Iluminación:</strong> 'Luz de neón', 'iluminación suave y difusa', 'hora dorada'.</li>
                        <li><strong>Referencias:</strong> 'Al estilo de Van Gogh', 'con la estética de Wes Anderson'.</li>
                    </ul>
                </AlertDescription>
            </Alert>
            <Button onClick={handleGenerateImage} disabled={isLoading || !prompt.trim()} size="lg" className="w-full">
                {isLoading ? ( <Loader className="mr-2 h-4 w-4 animate-spin" /> ) : ( <Wand2 className="mr-2 h-4 w-4" /> )}
                Generar Imagen
            </Button>
        </div>
        <div className="relative aspect-square w-full bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-dashed">
          {isLoading && <Loader className="h-12 w-12 animate-spin text-primary" />}
          {!isLoading && imageUrl && (
            <>
              <Image
                src={imageUrl}
                alt={prompt}
                fill
                className="object-contain animate-in fade-in-50"
              />
              <div className="absolute bottom-2 right-2">
                <Button onClick={handleDownload} size="icon" variant="secondary" title="Descargar imagen">
                    <Download className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
           {!isLoading && !imageUrl && (
            <div className="text-center text-muted-foreground p-8">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p>El lienzo está listo. ¿Qué quieres crear?</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
