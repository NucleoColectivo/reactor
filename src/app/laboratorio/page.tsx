
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Beaker, FlaskConical, Film, Gamepad2 } from 'lucide-react';

const experiments = [
  {
    id: 'enigma-cerebral',
    title: 'Enigma Cerebral',
    description: 'Un juego de trivia adaptativo con IA generativa para fomentar el desarrollo de diversas áreas cerebrales.',
    href: '/enigma-cerebral',
    imageId: 'enigma-hero',
    icon: <Gamepad2 />
  },
  {
    id: 'malla-sonica',
    title: 'Malla Sónica',
    description: 'Una red audiovisual interactiva que reacciona al sonido y al movimiento en tiempo real.',
    href: '/laboratorio/malla-sonica',
    imageId: 'lab-malla-sonica',
    icon: <Beaker />
  },
  {
    id: 'tejido-audiovisual',
    title: 'Tejido Audiovisual',
    description: 'Una experiencia VJ reactiva potenciada por IA para transformar la escena visual con prompts.',
    href: '/laboratorio/tejido-audiovisual',
    imageId: 'lab-tejido-audiovisual',
    icon: <Beaker />
  },
  {
    id: 'vigilia',
    title: 'Vigilia',
    description: 'Un sistema de vigilancia experimental que interpreta el movimiento y el sonido con una IA poética.',
    href: '/laboratorio/vigilia',
    imageId: 'lab-vigilia',
    icon: <Beaker />
  },
   {
    id: 'promts-lab',
    title: 'ProMTS Lab',
    description: 'Un IDE editorial para construir, probar y simular flujos de prompts complejos para proyectos editoriales.',
    href: '/laboratorio/promts-lab',
    imageId: 'res-deepseek',
    icon: <FlaskConical />
  },
   {
    id: 'videoarte-lab',
    title: 'Videoarte Lab',
    description: 'Generador visual con IA, banco de loops experimentales, editor narrativo y un laboratorio de streaming.',
    href: '/laboratorio/videoarte-lab',
    imageId: 'res-cinemateca',
    icon: <Film />
  },
];

export default function LaboratorioPage() {
  return (
    <>
      <div className="container py-12 md:py-24">
        <div className="text-center mb-16">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none highlight-bar">
            LABORATORIO DE CREACIÓN
          </h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground font-mono">
            Un espacio para la creación y experimentación con herramientas audiovisuales interactivas y generativas. Aquí es donde las ideas se prueban y se rompen.
          </p>
        </div>

        <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl highlight-bar">
                EXPERIMENTOS DEL LAB
            </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {experiments.map((exp) => {
            const image = PlaceHolderImages.find((p) => p.id === exp.imageId);
            return (
              <Card key={exp.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-xl group">
                {image && (
                  <div className="aspect-video overflow-hidden relative scanline-overlay">
                    <Image
                      alt={exp.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      height={300}
                      src={image.imageUrl}
                      width={400}
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                    <div className='flex-1'>
                        <CardTitle>{exp.title}</CardTitle>
                        <CardDescription>{exp.description}</CardDescription>
                    </div>
                     <div className="bg-primary/10 text-primary p-2">
                        {exp.icon}
                    </div>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button asChild className="w-full font-mono">
                    <Link href={exp.href}>
                      INICIAR_EXPERIMENTO
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
