import { coursePaths } from "@/lib/data";
import { notFound } from "next/navigation";
import { GameExploration } from "@/components/game/quiz";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Hourglass } from "lucide-react";
import { SandboxDialogue } from "@/components/game/sandbox-dialogue";
import { SandboxImage } from "@/components/game/sandbox-image";
import { ChallengeExplanation } from "@/components/game/challenge-explanation";
import { SandboxFinetune } from "@/components/game/sandbox-finetune";
import { SandboxCollaborativeAgents } from "@/components/game/sandbox-collaborative-agents";
import { SandboxToolRecommender } from "@/components/game/sandbox-tool-recommender";
import { SandboxAudio } from "@/components/game/sandbox-audio";

// Placeholder for other game types
function GamePlaceholder({ type }: { type: string }) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="items-center text-center">
                <Hourglass className="w-12 h-12 text-muted-foreground mb-4" />
                <CardTitle>Próximamente: {type}</CardTitle>
                <CardDescription>Esta interacción aún está en desarrollo.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p>Estamos trabajando para crear una experiencia de aprendizaje ligera y funcional. ¡Vuelve pronto!</p>
            </CardContent>
        </Card>
    );
}

export default function ModulePage({ params }: { params: { level: string; moduleId: string } }) {
    const course = coursePaths.find(p => p.level.toLowerCase() === params.level);
    const module = course?.modules.find(m => m.id === params.moduleId);

    if (!course || !module) {
        notFound();
    }

    let gameComponent;
    switch (module.gameType) {
        case "Exploration":
            if (module.exploration) {
                gameComponent = <GameExploration points={module.exploration} routeId={params.level} moduleId={params.moduleId} moduleTitle={module.title} />;
            } else {
                gameComponent = <GamePlaceholder type="Exploration" />;
            }
            break;
        case "Challenge":
            switch (module.id) {
                case 'b3':
                case 'a1':
                case 'a2':
                     gameComponent = <ChallengeExplanation 
                        concept={module.title} 
                        challengeDescription={module.description} 
                        routeId={params.level}
                        moduleId={params.moduleId}
                     />;
                     break;
                default:
                    gameComponent = <GamePlaceholder type="Challenge" />;
            }
            break;
        case "Sandbox":
            switch(module.id) {
                case 'b2':
                case 'b4':
                    gameComponent = <SandboxDialogue />;
                    break;
                case 'i1':
                case 'i2':
                case 'i3':
                    gameComponent = <SandboxImage />;
                    break;
                case 'a3':
                    gameComponent = <SandboxFinetune />;
                    break;
                case 'i4':
                    gameComponent = <SandboxToolRecommender />;
                    break;
                case 'a4':
                    gameComponent = <SandboxCollaborativeAgents />;
                    break;
                case 'i5':
                    gameComponent = <SandboxAudio />;
                    break;
                default:
                    gameComponent = <GamePlaceholder type="Sandbox" />;
            }
            break;
        default:
            notFound();
    }

    return (
        <div className="container py-12 md:py-24">
            <div className="mb-8">
                <Button asChild variant="ghost">
                    <Link href={`/courses/${params.level}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a {course.spanishLevel}: {course.title}
                    </Link>
                </Button>
            </div>
            
            {gameComponent}
        </div>
    );
}
