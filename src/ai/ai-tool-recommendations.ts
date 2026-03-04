'use server';
/**
 * @fileOverview Flujo de recomendación de herramientas de IA.
 *
 * - recomendarHerramientasIA - Una función que recomienda herramientas de IA según el módulo de aprendizaje y el progreso.
 * - RecomendarHerramientasIAInput - El tipo de entrada para la función recomendarHerramientasIA.
 * - RecomendarHerramientasIAOutput - El tipo de retorno para la función recomendarHerramientasIA.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecomendarHerramientasIAInputSchema = z.object({
  learningModule: z.string().describe('El módulo de aprendizaje de IA actual del usuario (básico, intermedio, avanzado).'),
  progressPercentage: z.number().describe('El porcentaje de progreso del usuario en el módulo de aprendizaje actual (0-100).'),
  userProfile: z.string().describe('El perfil o arquetipo del usuario (Creativo, Investigador, Emprendedor, Explorador).')
});
export type RecomendarHerramientasIAInput = z.infer<typeof RecomendarHerramientasIAInputSchema>;

const RecomendarHerramientasIAOutputSchema = z.object({
  toolRecommendations: z.array(
    z.object({
      title: z.string().describe('El título de la herramienta de IA recomendada.'),
      description: z.string().describe('Una breve descripción de la herramienta de IA y su relevancia para el módulo de aprendizaje.'),
      url: z.string().url().describe('La URL de la herramienta de IA.'),
      category: z.string().describe('La categoría de la herramienta de IA (p. ej., Generación de Imágenes, Aprendizaje Automático).'),
      reason: z.string().describe('Por qué se recomienda esta herramienta como un camino para la experimentación y el pensamiento crítico.')
    })
  ).describe('Una lista de 2 a 3 herramientas de IA recomendadas, específicamente seleccionadas según el nivel, perfil y progreso del usuario.'),
});
export type RecomendarHerramientasIAOutput = z.infer<typeof RecomendarHerramientasIAOutputSchema>;

export async function recomendarHerramientasIA(input: RecomendarHerramientasIAInput): Promise<RecomendarHerramientasIAOutput> {
  return recomendarHerramientasIAFlow(input);
}

const recomendarHerramientasIAPrompt = ai.definePrompt({
  name: 'recomendarHerramientasIAPrompt',
  input: {schema: RecomendarHerramientasIAInputSchema},
  output: {schema: RecomendarHerramientasIAOutputSchema},
  prompt: `Eres un curador pedagógico experto en Núcleo Colectivo. Tu misión es recomendar herramientas no como 'soluciones', sino como 'puntos de partida' para la exploración crítica y creativa, basándote en el contexto específico del usuario.

**Herramientas Disponibles por Categoría:**
- **Generación (No-Code):** RunwayML, Google Teachable Machine, Artbreeder, Midjourney, Canva, ElevenLabs, AIVA, ChatGPT, Google Gemini.
- **Análisis y Datos:** HuggingFace Spaces, Europeana, Wikimedia Commons, Internet Archive.
- **Código Creativo:** p5.js, Processing, Keras, Genkit.
- **Diseño y Prototipado:** Figma, Miro.

**Contexto del Usuario:**
- Nivel de Exploración: {{{learningModule}}}
- Progreso en el Nivel: {{{progressPercentage}}}%
- Perfil de Explorador: {{{userProfile}}}

**Reglas de Curaduría (¡Muy Importante!):**
1.  **Basado en el Nivel:**
    - **Básico:** Prioriza herramientas de 'Generación (No-Code)'. Son excelentes para entender conceptos sin barreras técnicas. (Ej: Teachable Machine, Canva, ChatGPT).
    - **Intermedio:** Combina herramientas de 'Generación' con 'Código Creativo' o 'Diseño'. Introduce conceptos más complejos. (Ej: RunwayML, p5.js, Figma).
    - **Avanzado:** Enfócate en 'Código Creativo' y 'Análisis y Datos'. Sugiere herramientas que permitan un control más profundo o la creación de sistemas. (Ej: HuggingFace, Keras, Genkit).

2.  **Basado en el Perfil:**
    - **Creativo:** Sugiere herramientas visuales o sonoras. (Ej: Midjourney, Artbreeder, RunwayML, AIVA).
    - **Investigador:** Recomienda plataformas de 'Análisis y Datos' o herramientas que permitan inspeccionar modelos. (Ej: HuggingFace, Europeana, Teachable Machine para analizar sesgos).
    - **Emprendedor:** Enfócate en herramientas para prototipado rápido y creación de contenido. (Ej: Canva, ElevenLabs, Figma, ChatGPT).
    - **Explorador:** Ofrece una mezcla inusual, conectando herramientas de diferentes categorías de forma sorprendente.

3.  **Basado en el Progreso:**
    - **0-30%:** Herramientas para inspiración y conceptualización.
    - **31-70%:** Herramientas para desarrollar y experimentar activamente.
    - **71-100%:** Herramientas para refinar, analizar o publicar un proyecto.

**Tu Tarea:**
Basado en las reglas de curaduría y el contexto del usuario, recomienda **exactamente 3 herramientas**. Para cada una, la 'razón' debe ser una provocación o una pregunta que invite a la experimentación, no una simple justificación.

**Ejemplo de una buena 'razón' (Perfil Creativo, Nivel Intermedio):**
"Te sugiero Artbreeder no para crear la imagen perfecta, sino para explorar el concepto de 'genealogía visual'. ¿Qué pasa cuando cruzas un rostro renacentista con una textura abstracta? ¿Qué nuevas identidades emergen?"

Ahora, proporciona tu recomendación en el formato JSON solicitado, aplicando las reglas de forma estricta.
`,
});

const recomendarHerramientasIAFlow = ai.defineFlow(
  {
    name: 'recomendarHerramientasIAFlow',
    inputSchema: RecomendarHerramientasIAInputSchema,
    outputSchema: RecomendarHerramientasIAOutputSchema,
  },
  async input => {
    const {output} = await recomendarHerramientasIAPrompt(input);
    return output!;
  }
);
