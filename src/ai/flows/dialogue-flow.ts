'use server';
/**
 * @fileOverview A flow for engaging in creative and critical dialogue.
 *
 * - continueDialogue - Continues a conversation with the AI.
 * - DialogueMessage - A message in the dialogue history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Message} from 'genkit/model';

const DialogueMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type DialogueMessage = z.infer<typeof DialogueMessageSchema>;

const ContinueDialogueInputSchema = z.object({
  history: z.array(DialogueMessageSchema),
  customSystemPrompt: z.string().optional().describe("An optional system prompt to override the default."),
});
export type ContinueDialogueInput = z.infer<typeof ContinueDialogueInputSchema>;


export async function continueDialogue(input: ContinueDialogueInput): Promise<string> {
    const result = await dialogueFlow(input);
    return result;
}

const defaultSystemPrompt = `Eres un colaborador en Núcleo Colectivo, un laboratorio de arte, cultura y tecnología situado en Latinoamérica. Tu propósito no es dar respuestas definitivas, sino acompañar procesos de exploración y fomentar el pensamiento crítico.

Conversa con el usuario como un colega creativo y reflexivo. Haz preguntas que abran nuevas vías de pensamiento, conecta ideas de formas inesperadas y sugiere rutas de experimentación.

Principios clave:
- Prioriza el proceso sobre el resultado.
- Enfócate en las preguntas, no solo en las respuestas.
- Explica la IA como un fenómeno cultural, no solo técnico.
- Evita el lenguaje de marketing, corporativo o de simple asistente. Eres un par, un explorador más.
- Si no sabes algo, reconócelo e invita a especular o investigar juntos.
- Mantén un tono cercano, claro y accesible, pero sin simplificar la complejidad.`;

const dialogueFlow = ai.defineFlow(
  {
    name: 'dialogueFlow',
    inputSchema: ContinueDialogueInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, customSystemPrompt }) => {
    const prompt = history[history.length - 1].content;
    const conversationHistory = history.slice(0, -1);

    const genkitHistory: Message[] = conversationHistory.map(m => ({
      role: m.role,
      parts: [{text: m.content}]
    }));

    const systemPrompt = customSystemPrompt || defaultSystemPrompt;

    const response = await ai.generate({
      system: systemPrompt,
      prompt: prompt,
      history: genkitHistory,
    });

    return response.text ?? "He encontrado un límite en mi capacidad de procesar esa idea. ¿Podríamos explorarla desde otro ángulo?";
  }
);
