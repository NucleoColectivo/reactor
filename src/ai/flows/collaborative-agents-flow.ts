'use server';
/**
 * @fileOverview A flow for simulating collaborative AI agents.
 *
 * - runCollaborativeAgents - Simulates a planner and an executor agent working together.
 * - AgentMessage - A message in the agent dialogue.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgentMessageSchema = z.object({
  agent: z.enum(['Planner', 'Executor']),
  content: z.string(),
});
export type AgentMessage = z.infer<typeof AgentMessageSchema>;

const CollaborativeAgentsInputSchema = z.object({
  task: z.string().describe('The high-level task for the agents to solve.'),
});
export type CollaborativeAgentsInput = z.infer<typeof CollaborativeAgentsInputSchema>;

const CollaborativeAgentsOutputSchema = z.object({
    dialogue: z.array(AgentMessageSchema)
});
export type CollaborativeAgentsOutput = z.infer<typeof CollaborativeAgentsOutputSchema>;

export async function runCollaborativeAgents(input: CollaborativeAgentsInput): Promise<CollaborativeAgentsOutput> {
  return collaborativeAgentsFlow(input);
}


const plannerSystemPrompt = `Eres un agente de IA llamado "Planificador". Tu única función es tomar una tarea compleja y descomponerla en un plan de 2 o 3 pasos claros, concisos y accionables para otro agente. No ejecutes la tarea. Solo crea el plan. Al final, solo debes entregar el plan.`;
const plannerUserPrompt = (task: string) => `La tarea es: "${task}"`;

const executorSystemPrompt = `Eres un agente de IA llamado "Ejecutor". Recibes una tarea y un plan de otro agente. Tu única función es ejecutar ese plan de manera creativa y detallada para completar la tarea.`;
const executorUserPrompt = (task: string, plan: string) => `La tarea original del usuario es: "${task}"\n\nEl plan a seguir es:\n"${plan}"\n\nTu ejecución creativa de la tarea:`;


const collaborativeAgentsFlow = ai.defineFlow(
  {
    name: 'collaborativeAgentsFlow',
    inputSchema: CollaborativeAgentsInputSchema,
    outputSchema: CollaborativeAgentsOutputSchema,
  },
  async ({ task }) => {
    // 1. Planner Agent
    const plannerResponse = await ai.generate({
        system: plannerSystemPrompt,
        prompt: plannerUserPrompt(task),
        temperature: 0.5,
    });
    const plan = plannerResponse.text ?? "No pude generar un plan.";

    const dialogue: AgentMessage[] = [{
        agent: 'Planner',
        content: plan,
    }];
    
    // If plan generation fails, don't proceed.
    if (plan === "No pude generar un plan.") {
        dialogue.push({
            agent: 'Executor',
            content: "No puedo ejecutar porque no se generó un plan.",
        });
        return { dialogue };
    }

    // 2. Executor Agent
    const executorResponse = await ai.generate({
        system: executorSystemPrompt,
        prompt: executorUserPrompt(task, plan),
        temperature: 0.8,
    });
    const execution = executorResponse.text ?? "No pude ejecutar el plan.";

    dialogue.push({
        agent: 'Executor',
        content: execution,
    });
    
    return { dialogue };
  }
);
