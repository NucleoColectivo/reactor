'use server';
/**
 * @fileOverview A flow for generating images from text prompts.
 *
 * - generateImage - Creates an image based on a user's description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A description of the image to generate.'),
  style: z.string().describe("The artistic style for the image."),
  aspectRatio: z.string().describe("The desired aspect ratio for the image, e.g., '1:1', '16:9'."),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
    imageDataUri: z.string().describe("The generated image as a data URI."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({ prompt, style, aspectRatio }) => {
    
    // Construct a detailed prompt
    const finalPrompt = `${style}, ${prompt}, aspect ratio ${aspectRatio}`;

    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: finalPrompt,
    });
    
    if (!media.url) {
        throw new Error('No se pudo generar la imagen.');
    }

    return { imageDataUri: media.url };
  }
);
