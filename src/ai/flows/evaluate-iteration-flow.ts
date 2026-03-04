'use server';
/**
 * @fileOverview A flow for providing feedback on a creative experiment's iteration.
 *
 * - evaluateIteration - Responds to the user's changes with critical feedback.
 * - EvaluateIterationInput - Input for the flow.
 * - EvaluateIterationOutput - Output from the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateIterationInputSchema = z.object({
  experimentType: z.string().describe("The type of experiment (e.g., 'juego', 'interaccion')."),
  experimentTitle: z.string().describe("The title of the experiment."),
  changes: z.string().describe("The description of changes made in this iteration."),
});
export type EvaluateIterationInput = z.infer<typeof EvaluateIterationInputSchema>;

const EvaluateIterationOutputSchema = z.object({
  feedback: z.string().describe("Constructive feedback on the iteration, suggesting next steps and posing critical questions."),
});
export type EvaluateIterationOutput = z.infer<typeof EvaluateIterationOutputSchema>;


export async function evaluateIteration(input: EvaluateIterationInput): Promise<EvaluateIterationOutput> {
  return evaluateIterationFlow(input);
}

const evaluationPrompt = ai.definePrompt({
    name: 'iterationEvaluationPrompt',
    input: { schema: EvaluateIterationInputSchema },
    output: { schema: EvaluateIterationOutputSchema },
    prompt: `
Eres un facilitador de laboratorio en Núcleo Play, un espacio de experimentación creativa. Tu rol es acompañar iteraciones, no solo resultados finales. Tu feedback debe ser constructivo, crítico y siempre proponer una siguiente pregunta o camino.

Contexto del Experimento:
- Título: {{{experimentTitle}}}
- Tipo: {{{experimentType}}}

Cambios en esta iteración:
"{{{changes}}}"

Tu Misión:
1.  **Valora el Esfuerzo:** Empieza reconociendo el cambio o la idea. Sé positivo pero no genérico.
2.  **Analiza Críticamente:** Basado en el tipo de experimento, haz una pregunta que profundice en la intención. Si es un 'juego', pregunta por la mecánica. Si es 'videoarte', por la estética. Si es 'interacción', por la experiencia del usuario.
3.  **Propón una Siguiente Iteración:** Sugiere un próximo paso concreto o una pregunta para explorar en la siguiente versión. Empuja los límites de la idea.
4.  **Sé Breve y Concreto:** Tu feedback debe ser una chispa, no un ensayo.

Ejemplo:
- Título: "Juego de gravedad sonora"
- Tipo: "juego"
- Cambios: "Mejoras en interacción sonora."
- Tu Feedback (feedback): "Interesante avance en la interacción sonora. ¿Cómo se siente esa 'mejora' para el jugador? ¿Es más intuitiva o más sorprendente? Para la v0.4, podrías probar qué pasa si la gravedad no solo reacciona a la intensidad, sino al tono. ¿Un sonido agudo podría invertir la gravedad?"

Responde únicamente en el formato JSON solicitado.
`
});

const evaluateIterationFlow = ai.defineFlow(
  {
    name: 'evaluateIterationFlow',
    inputSchema: EvaluateIterationInputSchema,
    outputSchema: EvaluateIterationOutputSchema,
  },
  async (input) => {
    const {output} = await evaluationPrompt(input);
    return output!;
  }
);
