import { SandboxImage } from "@/components/game/sandbox-image";

export default function VideoarteLabPage() {
  return (
    <div className="container py-12 md:py-24 flex flex-col items-center">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl highlight-bar">[ VIDEOARTE_LAB ]</h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground font-mono">
                Un generador visual para crear imágenes y texturas para proyectos de videoarte. El banco de loops y el editor narrativo vendrán en futuras actualizaciones.
            </p>
        </div>

        <SandboxImage />
    </div>
  );
}
