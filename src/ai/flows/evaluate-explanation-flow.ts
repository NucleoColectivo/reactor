'use server';
/**
 * @fileOverview A flow for reflecting on a user's explanation of a concept.
 *
 * - evaluateExplanation - Responds to the user's text with critical feedback.
 * - EvaluateExplanationInput - Input for the flow.
 * - EvaluateExplanationOutput - Output from the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateExplanationInputSchema = z.object({
  concept: z.string().describe("The concept the user is explaining."),
  explanation: z.string().describe("The user's explanation of the concept."),
});
export type EvaluateExplanationInput = z.infer<typeof EvaluateExplanationInputSchema>;

const EvaluateExplanationOutputSchema = z.object({
  feedback: z.string().describe("Reflective and constructive feedback on the user's explanation, designed to provoke further thought."),
});
export type EvaluateExplanationOutput = z.infer<typeof EvaluateExplanationOutputSchema>;


export async function evaluateExplanation(input: EvaluateExplanationInput): Promise<EvaluateExplanationOutput> {
  return evaluateExplanationFlow(input);
}

const evaluationPrompt = ai.definePrompt({
    name: 'evaluationPrompt',
    input: { schema: EvaluateExplanationInputSchema },
    output: { schema: EvaluateExplanationOutputSchema },
    prompt: `
Eres un pedagogo crítico y colaborador creativo en Núcleo Colectivo.
Tu tarea NO es 'evaluar' o 'calificar' la explicación de un usuario. Tu tarea es DIALOGAR con su reflexión, expandirla y proponer nuevas preguntas.

Concepto sobre el que reflexiona el usuario: {{{concept}}}
Reflexión del usuario:
"{{{explanation}}}"

Tu rol:
1.  **Valora el Aporte:** Inicia reconociendo la perspectiva del usuario de forma genuina. Evita frases como "es correcto" o "incorrecto". Usa "Es interesante cómo lo planteas..." o "Tu metáfora sobre... es muy potente".
2.  **Expande la Idea:** Conecta la explicación del usuario con un concepto más amplio (cultural, político, artístico).
3.  **Formula una Nueva Pregunta:** Termina con una pregunta abierta que invite al usuario a seguir pensando. No le des la solución, ábrele un nuevo camino.
4.  **Sé Breve y Provocador:** Tu feedback debe ser una chispa, no una clase magistral.

Ejemplo:
- Concepto: "Caja Negra"
- Usuario: "Es cuando no sabemos cómo piensa la IA."
- Tu Feedback (feedback): "Me gusta esa idea de 'no saber cómo piensa'. Nos lleva a preguntarnos: si no podemos explicar sus decisiones, ¿podemos realmente confiar en sistemas de IA para áreas críticas como la justicia o la medicina? ¿Qué valor le damos a la explicabilidad?"

Responde únicamente en el formato JSON solicitado.
`
});

const evaluateExplanationFlow = ai.defineFlow(
  {
    name: 'evaluateExplanationFlow',
    inputSchema: EvaluateExplanationInputSchema,
    outputSchema: EvaluateExplanationOutputSchema,
  },
  async (input) => {
    const {output} = await evaluationPrompt(input);
    return output!;
  }
);
