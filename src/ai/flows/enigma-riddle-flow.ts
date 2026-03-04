'use server';
/**
 * @fileOverview A flow for generating riddles for the Enigma Cerebral game.
 *
 * - generateEnigmaRiddle - Generates a riddle based on a given category.
 * - EnigmaRiddleInput - Input for the flow.
 * - EnigmaRiddleOutput - Output from the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiddleCategorySchema = z.enum(['Lógica y Razonamiento', 'Arte y Creatividad', 'Literatura y Lenguaje', 'Memoria y Conocimiento', 'Percepción y Atención']);
export type RiddleCategory = z.infer<typeof RiddleCategorySchema>;

const EnigmaRiddleInputSchema = z.object({
  category: RiddleCategorySchema.describe("The category of the riddle to generate."),
});
export type EnigmaRiddleInput = z.infer<typeof EnigmaRiddleInputSchema>;

const EnigmaRiddleOutputSchema = z.object({
  riddle: z.string().describe("The text of the riddle."),
  options: z.array(z.string()).length(4).describe("An array of 4 possible answers."),
  correctOptionIndex: z.number().min(0).max(3).describe("The 0-based index of the correct option in the 'options' array."),
  explanation: z.string().describe("A brief explanation of why the correct answer is right."),
});
export type EnigmaRiddleOutput = z.infer<typeof EnigmaRiddleOutputSchema>;

export async function generateEnigmaRiddle(input: EnigmaRiddleInput): Promise<EnigmaRiddleOutput> {
  return enigmaRiddleFlow(input);
}

const enigmaRiddlePrompt = ai.definePrompt({
  name: 'enigmaRiddlePrompt',
  input: {schema: EnigmaRiddleInputSchema},
  output: {schema: EnigmaRiddleOutputSchema},
  prompt: `
Eres el 'Maestro de Enigmas' del juego Enigma Cerebral. Tu tarea es generar un acertijo único, desafiante pero justo, basado en la categoría proporcionada.

**Categoría del Acertijo:** {{{category}}}

**Instrucciones:**
1.  **Crea el Acertijo:** Escribe un acertijo claro y conciso que ponga a prueba la habilidad del jugador en la categoría especificada. Evita acertijos demasiado obvios o que dependan de conocimiento extremadamente específico.
2.  **Genera Opciones:** Crea 4 opciones de respuesta. Solo una debe ser la correcta. Las otras tres deben ser "distractores" plausibles pero incorrectos.
3.  **Identifica la Correcta:** Determina el índice (de 0 a 3) de la respuesta correcta.
4.  **Explica la Solución:** Proporciona una explicación breve y clara de por qué la respuesta correcta es la adecuada.

**Ejemplo para la categoría 'Lógica y Razonamiento':**
-   **riddle:** "Tengo ciudades, pero no casas. Tengo montañas, pero no árboles. Tengo agua, pero no peces. ¿Qué soy?"
-   **options:** ["Un sueño", "Un mapa", "Un libro de geografía", "Un globo terráqueo"]
-   **correctOptionIndex:** 1
-   **explanation:** "Un mapa es una representación que contiene ciudades, montañas y cuerpos de agua, pero no los objetos físicos reales."

**Ejemplo para la categoría 'Arte y Creatividad':**
-   **riddle:** "Soy un movimiento artístico que rompió con la perspectiva tradicional, usando formas geométricas y múltiples puntos de vista para representar la realidad. Picasso y Braque fueron mis pioneros. ¿Qué movimiento soy?"
-   **options:** ["Surrealismo", "Impresionismo", "Cubismo", "Abstracto"]
-   **correctOptionIndex:** 2
-   **explanation:** "El Cubismo, iniciado por Picasso y Braque, es conocido por su enfoque en la geometría y la representación de un sujeto desde múltiples ángulos simultáneamente."

Ahora, genera un nuevo acertijo para la categoría proporcionada, siguiendo el formato JSON exacto.
`,
});

const enigmaRiddleFlow = ai.defineFlow(
  {
    name: 'enigmaRiddleFlow',
    inputSchema: EnigmaRiddleInputSchema,
    outputSchema: EnigmaRiddleOutputSchema,
  },
  async input => {
    const {output} = await enigmaRiddlePrompt(input);
    return output!;
  }
);
