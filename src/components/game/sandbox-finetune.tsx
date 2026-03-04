'use client';

import { useState, useRef, useEffect } from 'react';
import { continueDialogue, type DialogueMessage } from '@/ai/flows/dialogue-flow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader, Edit, BrainCircuit, MessageSquare, TestTube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

type View = 'configuring' | 'chatting';

export function SandboxFinetune() {
  const [view, setView] = useState<View>('configuring');
  const [systemPrompt, setSystemPrompt] = useState('Eres un poeta que solo habla en haikus.');
  const [history, setHistory] = useState<DialogueMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleStartChatting = () => {
    if (!systemPrompt.trim()) {
        toast({
            variant: "destructive",
            title: "Personalidad vacía",
            description: "Debes definir una personalidad para la IA.",
        });
        return;
    }
    setView('chatting');
  }
  
  const handleReset = () => {
    setView('configuring');
    setHistory([]);
    setInput('');
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage: DialogueMessage = { role: 'user', content: input };
    const newHistory = [...history, newUserMessage];

    setHistory(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const modelResponse = await continueDialogue({ 
          history: newHistory,
          customSystemPrompt: systemPrompt 
      });
      const newModelMessage: DialogueMessage = { role: 'model', content: modelResponse };
      setHistory(prev => [...prev, newModelMessage]);
    } catch (error) {
      console.error('Error in dialogue flow:', error);
       toast({
        variant: "destructive",
        title: "Error en el diálogo",
        description: "Tuve un problema para procesar tu idea. Intenta de nuevo.",
      });
      setHistory(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [history, isLoading]);


  if (view === 'configuring') {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Ajuste Fino (Simulado) 🧪</CardTitle>
                <CardDescription>
                    Define la "personalidad" o las instrucciones base de la IA. Esto simula cómo el "ajuste fino" especializa a un modelo para tareas concretas.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="system-prompt" className="font-semibold">Personalidad de la IA (System Prompt)</Label>
                    <Textarea
                        id="system-prompt"
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="Ej: Eres un pirata del siglo XVII. Habla como tal..."
                        rows={8}
                        className="text-base"
                    />
                </div>
                 <Alert variant="default" className="border-dashed">
                    <BrainCircuit className="h-4 w-4" />
                    <AlertTitle>¿Qué está pasando aquí?</AlertTitle>
                    <AlertDescription>
                        Estás modificando el "system prompt", una instrucción fundamental que guía el comportamiento de la IA en cada interacción. Un verdadero "ajuste fino" es un proceso más complejo de re-entrenamiento, pero esto te da una idea del poder de la personalización.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleStartChatting} size="lg">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Iniciar Conversación
                </Button>
            </CardFooter>
        </Card>
    );
  }


  return (
    <Card className="w-full max-w-2xl mx-auto flex flex-col" style={{height: 'calc(100vh - 220px)'}}>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Conversando con tu IA 🤖</CardTitle>
                <CardDescription>La IA ahora seguirá la personalidad que definiste.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Personalidad
            </Button>
        </div>
        <Alert variant="default" className="mt-4 text-sm bg-primary/5 border-primary/20">
            <TestTube className="h-4 w-4 text-primary" />
            <AlertDescription>
                <span className="font-semibold text-primary">Personalidad Activa:</span> <span className="text-muted-foreground italic">"{systemPrompt}"</span>
            </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {history.map((msg, index) => (
              <div key={index} className={cn('flex items-start gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'model' && (
                  <div className="p-2 bg-primary/10 text-primary rounded-full">
                    <Bot size={20} />
                  </div>
                )}
                <div className={cn('p-3 rounded-lg max-w-[80%] shadow-sm prose-sm', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                 {msg.role === 'user' && (
                  <div className="p-2 bg-muted rounded-full">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                  <div className="p-2 bg-primary/10 text-primary rounded-full">
                    <Bot size={20} />
                  </div>
                  <div className="p-3 rounded-lg bg-muted flex items-center">
                     <Loader className="animate-spin h-5 w-5 text-primary" />
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="w-full flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Conversa con tu IA..."
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            <Send size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
