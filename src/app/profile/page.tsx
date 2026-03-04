'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, collection, query, where } from 'firebase/firestore';
import { useUser, useDoc, useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import type { UserProfile } from '@/types/user';
import type { CreativeProject, Progress } from '@/types/creative_work';
import type { PlayExperiment } from '@/types/play';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader, BookOpen, Brush, Trophy, FolderKanban, Beaker, Trash2, ArrowRight, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

function ProfileSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <section className="system-border">
            <header className="p-4 border-b-2 border-foreground/10 flex items-center gap-4">
                <div className="text-primary">{icon}</div>
                <h2 className="text-xl font-bold font-headline tracking-tighter">{title}</h2>
            </header>
            <div className="p-4 md:p-6">
                {children}
            </div>
        </section>
    )
}

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  // --- Fetch user progress ---
  const progressQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'progress'), where('userId', '==', user.uid));
  }, [firestore, user]);
  const { data: progressData, isLoading: isProgressLoading } = useCollection<Progress>(progressQuery);

  // --- Fetch user projects ---
  const projectsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'projects_creativo'), where('userId', '==', user.uid));
  }, [firestore, user]);
  const { data: projectsData, isLoading: isProjectsLoading } = useCollection<CreativeProject>(projectsQuery);

  // --- Fetch user experiments ---
  const experimentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'play_experiments'), where('authorId', '==', user.uid));
  }, [firestore, user]);
  const { data: experimentsData, isLoading: areExperimentsLoading } = useCollection<PlayExperiment>(experimentsQuery);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleDeleteExperiment = (experimentId: string) => {
    if (!firestore) return;
    const experimentDocRef = doc(firestore, 'play_experiments', experimentId);
    deleteDocumentNonBlocking(experimentDocRef);
    toast({
        title: "Experimento eliminado",
        description: "Tu prototipo ha sido eliminado del laboratorio."
    });
  };

  const isLoading = isUserLoading || isProfileLoading || isProgressLoading || isProjectsLoading || areExperimentsLoading;

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  const userInitial = userProfile?.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'A';
  const displayName = userProfile?.displayName || user.displayName || user.email;
  const registrationDate = userProfile ? new Date(userProfile.registrationDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : (user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A');

  return (
    <div className="container py-12 md:py-24 space-y-12">
      <Card className="mx-auto max-w-2xl system-border">
        <CardHeader className="flex flex-row items-center gap-4 !border-b-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.photoURL ?? ''} />
            <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {user.isAnonymous ? 'Usuario Anónimo' : displayName}
            </CardTitle>
            <CardDescription>
              Perfil del Explorador / Miembro desde {registrationDate}
            </CardDescription>
          </div>
        </CardHeader>
        {!user.isAnonymous && (
            <CardContent className="space-y-2 pt-0">
                <div className="text-sm">
                    <span className="font-mono text-muted-foreground mr-2">EMAIL:</span>
                    <span className="font-mono">{user.email}</span>
                </div>
                <div className="text-sm">
                    <span className="font-mono text-muted-foreground mr-2">UID:</span>
                    <span className="text-xs break-all font-mono">{user.uid}</span>
                </div>
            </CardContent>
        )}
      </Card>
      
      {/* User Progress Section */}
      <ProfileSection title="MI_PROGRESO" icon={<Trophy className="h-8 w-8"/>}>
        {progressData && progressData.length > 0 ? (
            <div className="space-y-6">
                {progressData.map(p => (
                    <div key={p.id} className="system-border p-4">
                        <h3 className="font-headline text-lg capitalize text-primary">{p.routeId.replace('_', ' ')}</h3>
                        <p className="text-xs text-muted-foreground font-mono mb-4">Actualizado: {new Date(p.updatedAt).toLocaleDateString()}</p>
                        <Separator className="my-4"/>
                        <div>
                            <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider font-mono">Módulos Completados:</h4>
                            {p.completedModules.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {p.completedModules.map(m => <Badge key={m} variant="secondary" className="font-mono">{m}</Badge>)}
                                </div>
                            ) : <p className="text-sm text-muted-foreground font-mono">Ninguno aún.</p>}
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold mt-4 mb-2 text-sm uppercase tracking-wider font-mono">Ejercicios Completados:</h4>
                            {p.completedExercises.length > 0 ? (
                               <div className="flex flex-wrap gap-2">
                                    {p.completedExercises.map(e => <Badge key={e} variant="outline" className="font-mono">{e}</Badge>)}
                                </div>
                            ) : <p className="text-sm text-muted-foreground font-mono">Ninguno aún.</p>}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center text-muted-foreground font-mono p-8 border-dashed border-foreground/20">
                <p className="mb-4">Aún no has comenzado ninguna ruta. ¡Es el momento perfecto para explorar!</p>
                <Button asChild>
                    <Link href="/courses">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ver Rutas de Aprendizaje
                    </Link>
                </Button>
            </div>
        )}
    </ProfileSection>

    {/* Creative Projects Section */}
     <ProfileSection title="MIS_PROYECTOS_CREATIVOS" icon={<FolderKanban className="h-8 w-8"/>}>
        {projectsData && projectsData.length > 0 ? (
             <div className="space-y-4">
                {projectsData.map(p => (
                    <div key={p.id} className="system-border p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                         <div className="flex-1">
                            <h3 className="font-headline text-lg text-primary">{p.title}</h3>
                            <p className="text-xs text-muted-foreground font-mono mb-2">Iniciado: {new Date(p.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground font-mono">{p.description || "Sin descripción."}</p>
                         </div>
                         <div className="shrink-0">
                            <Badge className={p.status === 'completado' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>{p.status.replace('_', ' ')}</Badge>
                         </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center text-muted-foreground font-mono p-8 border-dashed border-foreground/20">
                <p className="text-muted-foreground text-center mb-4">Aún no tienes proyectos. ¡Completa un desafío para empezar a crear!</p>
                 <Button asChild>
                    <Link href="/courses">
                        <Brush className="mr-2 h-4 w-4" />
                        Comenzar una Ruta
                    </Link>
                </Button>
            </div>
        )}
      </ProfileSection>

      {/* User Experiments Section */}
      <ProfileSection title="MIS_PROTOTIPOS_EN_KINEFONÍA" icon={<Cpu className="h-8 w-8"/>}>
        {experimentsData && experimentsData.length > 0 ? (
            <div className="space-y-4">
                {experimentsData.map(exp => (
                    <div key={exp.id} className="system-border p-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                             <div className="flex-1">
                                <div className="flex items-center gap-2">
                                     <h3 className="font-headline text-lg text-primary">{exp.title}</h3>
                                     {exp.publishable && (
                                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                                            Publicable
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground font-mono capitalize mb-2">{exp.type.replace('_', ' ')}</p>
                                <p className="text-sm text-muted-foreground font-mono">{exp.description || "Sin descripción."}</p>
                            </div>
                            <div className="flex items-center gap-2 self-start md:self-center">
                                <Button asChild size="sm">
                                    <Link href={`/play/${exp.id}`}>
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                        Ver
                                    </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" className="h-9 w-9">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente tu experimento y todas sus iteraciones.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteExperiment(exp.id)}>
                                            Eliminar
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center text-muted-foreground font-mono p-8 border-dashed border-foreground/20">
                <p className="text-muted-foreground text-center mb-4">Aún no has creado ningún prototipo. ¡Anímate a explorar el laboratorio!</p>
                <Button asChild>
                    <Link href="/play/create">
                        <Cpu className="mr-2 h-4 w-4" />
                        Crear Prototipo en Kinefonía
                    </Link>
                </Button>
            </div>
        )}
    </ProfileSection>
</div>
  );
}
