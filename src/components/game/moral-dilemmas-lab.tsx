'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, User, ArrowRight, Globe, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const DilemmaScene = ({ onChoice }: { onChoice: (choice: 'passenger' | 'pedestrians') => void }) => {
    const carImage = PlaceHolderImages.find(p => p.id === 'ethics-car');

    return (
        <motion.div
            key="scene"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="text-center"
        >
            <h3 className="mb-2 text-primary font-headline text-2xl">EL DILEMA DEL VEHÍCULO AUTÓNOMO</h3>
            <p className="mb-6 max-w-lg mx-auto font-mono text-muted-foreground">
                Un vehículo autónomo sufre una falla de frenos. Debe tomar una decisión instantánea. No hay tiempo para evitar el impacto.
            </p>

            <div className="relative aspect-video max-w-md mx-auto bg-muted/20 rounded-lg flex items-center justify-center p-4 overflow-hidden border-2 border-dashed border-primary/20 mb-8">
                {carImage && <Image src={carImage.imageUrl} alt="dilemma" fill objectFit="cover" className="opacity-10 blur-sm" data-ai-hint={carImage.imageHint} />}
                
                <div className="relative z-10 w-full flex items-center justify-around">
                     <div className="flex flex-col items-center text-red-400 text-center w-28">
                        <Users size={48} />
                        <p className="font-bold mt-2">5 Peatones</p>
                        <p className="text-xs text-red-400/80">en la trayectoria</p>
                     </div>
                     
                     <div className="flex flex-col items-center text-foreground/50 opacity-50">
                        <ArrowRight size={32} className="mb-2"/>
                        <span className="text-xs font-mono">IMPACTO INMINENTE</span>
                     </div>
                     
                     <div className="flex flex-col items-center text-blue-400 text-center w-28">
                         <User size={48} />
                         <p className="font-bold mt-2">1 Pasajero</p>
                         <p className="text-xs text-blue-400/80">dentro del vehículo</p>
                     </div>
                </div>
            </div>

            <p className="mb-6 text-lg font-semibold font-headline">¿QUÉ ACCIÓN DEBE TOMAR LA IA?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="text-left p-4 border-2 border-border hover:border-primary transition-all cursor-pointer flex flex-col gap-1" onClick={() => onChoice('pedestrians')}>
                    <span className="font-bold text-base text-primary">Opción A: Desviarse</span>
                    <span className="text-sm text-muted-foreground">El vehículo se desvía y choca contra una barrera.</span>
                    <span className="text-xs font-bold text-destructive mt-2">Consecuencia: El pasajero es sacrificado para salvar a los peatones.</span>
                </Card>
                <Card className="text-left p-4 border-2 border-border hover:border-primary transition-all cursor-pointer flex flex-col gap-1" onClick={() => onChoice('passenger')}>
                     <span className="font-bold text-base text-primary">Opción B: Seguir Recto</span>
                    <span className="text-sm text-muted-foreground">El vehículo continúa su trayectoria programada.</span>
                    <span className="text-xs font-bold text-destructive mt-2">Consecuencia: Los peatones son sacrificados para salvar al pasajero.</span>
                </Card>
            </div>
        </motion.div>
    );
};

const ConsequenceScene = ({ choice, onReset }: { choice: 'passenger' | 'pedestrians'; onReset: () => void }) => {
    const saved = choice === 'pedestrians' ? 5 : 1;
    const sacrificed = choice === 'pedestrians' ? 1 : 5;
    const savedGroup = choice === 'pedestrians' ? 'a los peatones' : 'al pasajero';
    const sacrificedGroup = choice === 'pedestrians' ? 'al pasajero' : 'a los peatones';

    return (
        <motion.div
            key="consequence"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
        >
            <h3 className="mb-2 text-primary font-headline text-2xl">CONSECUENCIA DE LA DECISIÓN</h3>
            <p className="mb-6 max-w-lg mx-auto font-mono text-muted-foreground">
                Has programado el algoritmo para que siga la regla ética de priorizar <span className="text-foreground font-semibold">{savedGroup}</span> sobre <span className="text-foreground font-semibold">{sacrificedGroup}</span>.
            </p>

            <div className="bg-muted p-6 rounded-lg mb-8 text-center border border-border">
                <p className="text-3xl font-bold font-headline">
                    Salvaste a <span className="text-primary">{saved}</span> vida{saved > 1 ? 's' : ''} y sacrificaste <span className="text-destructive">{sacrificed}.</span>
                </p>
                <p className="mt-4 text-lg italic text-muted-foreground font-mono">"El código se ejecutó. La decisión es irreversible."</p>
            </div>

            <Card className="text-left bg-background/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-xl"><Globe size={20} className="text-primary" />Perspectiva Global</CardTitle>
                    <CardDescription className="font-mono">Tu preferencia se compara con tendencias globales del estudio Moral Machine del MIT.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm font-mono">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong className="text-foreground">Culturas Colectivistas (ej. Japón):</strong> Muestran una fuerte tendencia a salvar a los peatones (el grupo más grande).</li>
                        <li><strong className="text-foreground">Culturas Individualistas (ej. EE.UU.):</strong> Muestran una preferencia menor por salvar a los peatones, con más variabilidad.</li>
                        <li><strong className="text-foreground">Conclusión General:</strong> La mayoría de personas prefiere salvar más vidas, pero la cultura y el contexto influyen fuertemente en la decisión.</li>
                    </ul>
                </CardContent>
            </Card>

            <Button onClick={onReset} className="mt-8" size="lg">
                <RefreshCw className="mr-2 h-4 w-4"/>
                Volver a Decidir
            </Button>
        </motion.div>
    );
};


export function MoralDilemmasLab() {
    const [step, setStep] = useState<'dilemma' | 'consequence'>('dilemma');
    const [userChoice, setUserChoice] = useState<'passenger' | 'pedestrians' | null>(null);

    const handleChoice = (choice: 'passenger' | 'pedestrians') => {
        setUserChoice(choice);
        setStep('consequence');
    };
    
    const handleReset = () => {
        setUserChoice(null);
        setStep('dilemma');
    }

    return (
        <div className="p-4">
             <AnimatePresence mode="wait">
                {step === 'dilemma' && <DilemmaScene onChoice={handleChoice} />}
                {step === 'consequence' && userChoice && <ConsequenceScene choice={userChoice} onReset={handleReset} />}
            </AnimatePresence>
        </div>
    );
}
