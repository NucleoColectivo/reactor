'use client';

import { useState, useRef, useEffect } from 'react';
import { continueDialogue, type DialogueMessage } from '@/ai/flows/dialogue-flow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const initialMessage: DialogueMessage = {
  role: 'model',
  content: 'Hola, soy tu colaborador de IA. ¿Qué idea te gustaría explorar hoy? Podemos hablar de arte, tecnología, o cualquier cosa que conecte ambas.',
};

export function SandboxDialogue() {
  const [history, setHistory] = useState<DialogueMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setHistory([initialMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage: DialogueMessage = { role: 'user', content: input };
    const newHistory = [...history, newUserMessage];

    setHistory(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const modelResponse = await continueDialogue({ history: newHistory });
      const newModelMessage: DialogueMessage = { role: 'model', content: modelResponse };
      setHistory(prev => [...prev, newModelMessage]);
    } catch (error) {
      console.error('Error in dialogue flow:', error);
       toast({
        variant: "destructive",
        title: "Error en el diálogo",
        description: "Tuve un problema para procesar tu idea. Intenta de nuevo.",
      });
      // remove the user message if the call fails
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

  return (
    <Card className="w-full h-full flex flex-col border-0 rounded-lg">
      <CardHeader>
        <CardTitle>Diálogos con IA</CardTitle>
        <CardDescription>Explora ideas, haz preguntas y colabora con una IA entrenada para el pensamiento crítico y creativo.</CardDescription>
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
                <div className={cn('p-3 rounded-lg max-w-[80%] shadow-sm', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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
            placeholder="Escribe tu idea aquí..."
            disabled={isLoading}
            autoFocus
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            <Send size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
