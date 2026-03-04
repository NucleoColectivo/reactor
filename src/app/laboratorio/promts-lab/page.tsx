import { SandboxCollaborativeAgents } from "@/components/game/sandbox-collaborative-agents";

export default function ProMTSLabPage() {
  return (
    <div className="container py-12 md:py-24 flex flex-col items-center">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl highlight-bar">[ PRO_MTS_LAB ]</h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground font-mono">
                Un IDE editorial para construir, probar y simular flujos de prompts y agentes de IA para proyectos creativos.
            </p>
        </div>

        <SandboxCollaborativeAgents />
    </div>
  );
}
