'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader, Wand2, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const prompts = [
    "Una persona líder",
    "Una familia feliz",
    "Un programador brillante",
    "Una persona peligrosa",
];

export function BiasLab() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState('');
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [hackedPrompt, setHackedPrompt] = useState("Una líder comunitaria indígena de 60 años dirigiendo un laboratorio de innovación");
    const [hackedImage, setHackedImage] = useState<string | null>(null);
    const { toast } = useToast();

    const handleGenerate = async (prompt: string) => {
        setSelectedPrompt(prompt);
        setIsLoading(true);
        setGeneratedImages([]);
        try {
            const result = await generateImage({ prompt, style: 'realistic photography', aspectRatio: '1:1' });
            setGeneratedImages(Array(6).fill(result.imageDataUri));
            setStep(2);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error de IA', description: 'No se pudieron generar las imágenes.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleHack = async () => {
        setIsLoading(true);
        setHackedImage(null);
        try {
            const result = await generateImage({ prompt: hackedPrompt, style: 'realistic photography', aspectRatio: '1:1' });
            setHackedImage(result.imageDataUri);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error de IA', description: 'No se pudo generar la imagen.' });
        } finally {
            setIsLoading(false);
        }
    }

    if (step === 1) {
        return (
            <div className="space-y-4 text-center p-4">
                <h3 className="font-semibold text-xl">Paso 1: Genera</h3>
                <p className="text-sm text-muted-foreground">Elige un prompt para que la IA genere 6 imágenes.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {prompts.map(p => (
                        <Button key={p} variant="outline" size="lg" className="h-12" onClick={() => handleGenerate(p)} disabled={isLoading}>
                            {isLoading && selectedPrompt === p ? <Loader className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                            {p}
                        </Button>
                    ))}
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="space-y-4 p-4">
                <h3 className="font-semibold text-xl">Paso 2: Analiza</h3>
                <p className="text-sm text-muted-foreground">Observa las imágenes para <span className="font-bold text-primary">"{selectedPrompt}"</span>. ¿Qué patrones ves?</p>
                <div className="grid grid-cols-3 gap-2">
                    {generatedImages.map((src, i) => <Image key={i} src={src} alt={`Generated image ${i + 1}`} width={150} height={150} className="rounded-md object-cover aspect-square" />)}
                </div>
                <Alert variant="destructive" className="border-destructive/30 bg-destructive/5 text-destructive-foreground">
                    <AlertTitle className="text-amber-400">¡Curioso!</AlertTitle>
                    <AlertDescription className="text-amber-400/80">
                        ¿La IA fue objetiva o heredó el mundo tal como está? Reflexiona sobre el género, tono de piel, edad y contexto económico.
                    </AlertDescription>
                </Alert>
                <Button onClick={() => setStep(3)} className="w-full">
                    Paso 3: Hackea el Sesgo
                    <ArrowRight className="ml-2" />
                </Button>
            </div>
        )
    }

    if (step === 3) {
        return (
            <div className="space-y-4 p-4">
                <h3 className="font-semibold text-xl">Paso 3: Hackea el Sesgo</h3>
                <p className="text-sm text-muted-foreground">Reescribe el prompt para romper el patrón que encontraste.</p>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground">PROMPT ORIGINAL</label>
                        <p className="p-3 border rounded-md bg-muted text-sm font-mono mt-1">{selectedPrompt}</p>
                    </div>
                     <div>
                        <label htmlFor="hacked-prompt" className="text-xs font-semibold text-primary">NUEVO PROMPT (SÉ ESPECÍFICO)</label>
                        <Textarea id="hacked-prompt" value={hackedPrompt} onChange={e => setHackedPrompt(e.target.value)} className="mt-1 font-mono" />
                    </div>
                </div>
                 <Button onClick={handleHack} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                    Generar Comparación
                </Button>
                {hackedImage && (
                    <div className="grid grid-cols-2 gap-4 pt-4 animate-in fade-in-50">
                         <div>
                            <p className="text-xs text-center font-semibold mb-1 text-muted-foreground">ANTES</p>
                            <Image src={generatedImages[0]} alt="Original" width={200} height={200} className="rounded-md mx-auto aspect-square object-cover" />
                         </div>
                         <div>
                             <p className="text-xs text-center font-semibold mb-1 text-primary">DESPUÉS</p>
                            <Image src={hackedImage} alt="Hacked" width={200} height={200} className="rounded-md mx-auto aspect-square object-cover" />
                         </div>
                    </div>
                )}
            </div>
        )
    }

    return null;
}