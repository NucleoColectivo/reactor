'use client';

import { useState } from 'react';
import type { ExplorationPoint } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRight, Lightbulb, CheckCircle2, XCircle, Trophy, Star, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import type { Progress as UserProgress } from '@/types/creative_work';
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

type GameExplorationProps = {
  points: ExplorationPoint[];
  routeId: string;
  moduleId: string;
  moduleTitle: string;
};

const StarRating = ({ rating, totalStars = 5 }: { rating: number, totalStars?: number }) => {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: totalStars }).map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        "h-8 w-8",
                        i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
                    )}
                />
            ))}
        </div>
    );
};

export function GameExploration({ points, routeId, moduleId, moduleTitle }: GameExplorationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const progressQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'progress'), where('userId', '==', user.uid), where('routeId', '==', routeId));
  }, [user, firestore, routeId]);

  const { data: progressData, isLoading: isProgressLoading } = useCollection<UserProgress>(progressQuery);

  const totalPoints = points.length;
  const currentPoint = points[currentIndex];

  const handleSelectOption = (index: number) => {
    if (showReflection) return;
    setSelectedOption(index);
    setShowReflection(true);
    if (index === currentPoint.correctOptionIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalPoints - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowReflection(false);
      setSelectedOption(null);
    } else {
      if (user && firestore && !isProgressLoading) {
        const currentProgress = progressData?.[0];
        
        if (currentProgress) {
          const progressRef = doc(firestore, 'progress', currentProgress.id);
          const updatedModules = [...new Set([...currentProgress.completedModules, moduleId])];
          updateDocumentNonBlocking(progressRef, {
              completedModules: updatedModules,
              updatedAt: new Date().toISOString()
          });

        } else {
          const newProgressRef = doc(collection(firestore, 'progress'));
          const newProgress: UserProgress = {
            id: newProgressRef.id,
            userId: user.uid,
            routeId: routeId,
            completedModules: [moduleId],
            completedExercises: [],
            updatedAt: new Date().toISOString(),
          };
          setDocumentNonBlocking(newProgressRef, newProgress, { merge: false });
        }

        toast({
          title: "¡Progreso Guardado! 🏆",
          description: `Completaste el módulo: "${moduleTitle}".`,
        });
      }
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const finalStars = Math.round((score / totalPoints) * 5);
    return (
        <Card className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center p-8">
            <Trophy className="h-24 w-24 text-yellow-400 mb-4" />
            <CardTitle className="text-3xl font-headline mb-2">¡Módulo Completado!</CardTitle>
            <CardDescription className="text-lg mb-6">
                Obtuviste {score} de {totalPoints} respuestas correctas.
            </CardDescription>
            <StarRating rating={finalStars} />
            <p className="text-muted-foreground text-sm mt-2 mb-8">(Tu calificación: {finalStars} de 5 estrellas)</p>
            <Button onClick={() => window.history.back()} size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la Ruta
            </Button>
        </Card>
    )
  }


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
            <CardDescription>Punto de exploración {currentIndex + 1} de {totalPoints}</CardDescription>
        </div>
        <Progress value={((currentIndex + 1) / totalPoints) * 100} className="w-full transition-all duration-300" />
        <CardTitle className="pt-6 text-2xl font-headline">{currentPoint.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedOption !== null ? String(selectedOption) : ''}
          onValueChange={(value) => handleSelectOption(Number(value))}
          disabled={showReflection}
          className="space-y-3"
        >
          {currentPoint.options.map((option, index) => {
            const isCorrect = index === currentPoint.correctOptionIndex;
            const isSelected = selectedOption === index;
            return (
                <Label 
                key={index}
                htmlFor={`option-${index}`}
                className={cn(`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70`,
                    showReflection && isCorrect ? 'border-green-500 bg-green-500/10' : 'border-border hover:border-primary/50 hover:bg-muted/50',
                    showReflection && isSelected && !isCorrect ? 'border-destructive bg-destructive/10' : ''
                )}
                >
                <RadioGroupItem value={String(index)} id={`option-${index}`} className="mt-1 h-5 w-5"/>
                <span className="flex-1 text-base">{option}</span>
                {showReflection && isSelected && isCorrect && <CheckCircle2 className="h-6 w-6 text-green-500 animate-in fade-in zoom-in-50" />}
                {showReflection && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-destructive animate-in fade-in zoom-in-50" />}
                {showReflection && !isSelected && isCorrect && <CheckCircle2 className="h-6 w-6 text-green-500/50" />}
                </Label>
            )
          })}
        </RadioGroup>
        
        {showReflection && selectedOption !== null && (
          <Alert variant={selectedOption === currentPoint.correctOptionIndex ? "default" : "destructive"} className={cn("p-4 rounded-lg animate-in fade-in-50 mt-6!", selectedOption === currentPoint.correctOptionIndex ? 'bg-primary/5 border-primary/20' : '')}>
            <Lightbulb className="h-5 w-5 text-primary" />
            <AlertTitle className="font-bold text-primary">Punto de Reflexión</AlertTitle>
            <AlertDescription className="text-foreground/90 mt-2 text-base">
              {currentPoint.reflections[selectedOption]}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-6">
        {showReflection && (
          <Button onClick={handleNext} autoFocus size="lg" disabled={isProgressLoading}>
            {currentIndex < totalPoints - 1 ? 'Siguiente' : 'Finalizar Exploración'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
