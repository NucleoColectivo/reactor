'use client';

import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SandboxDialogue } from "@/components/game/sandbox-dialogue";

export function FloatingDialogueButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 animate-in fade-in-50 zoom-in-95"
          aria-label="Abrir Diálogos con IA"
        >
          <MessageSquare className="h-7 w-7" />
          <span className="sr-only">Abrir Diálogos con IA</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl h-[80vh] flex flex-col p-0 rounded-lg">
        <DialogTitle className="sr-only">Diálogos con IA</DialogTitle>
        <SandboxDialogue />
      </DialogContent>
    </Dialog>
  );
}
