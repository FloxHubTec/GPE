
import { Task } from '../types';

/**
 * Algoritmo de Pontuação Floxhub
 * Fórmula: (Soma(Peso Tarefas Concluídas)) - (Tempo Ocioso * Penalidade)
 */

interface ScoreInput {
  completedTasks: Task[];
  idleTimeMinutes: number;
}

const IDLE_PENALTY_RATE = 0.5; // 0.5 pontos perdidos por minuto ocioso

export const calculateSessionScore = (input: ScoreInput): number => {
  const taskPoints = input.completedTasks.reduce((acc, task) => acc + task.weight, 0);
  const idlePenalty = input.idleTimeMinutes * IDLE_PENALTY_RATE;
  
  const finalScore = Math.max(0, taskPoints - idlePenalty);
  return Math.round(finalScore);
};

/**
 * Simula a atualização no banco de dados
 * Em um ambiente real, isso usaria Prisma:
 * await prisma.user.update({ where: { id }, data: { currentScore: { increment: points } } })
 */
export const syncScoreToBackend = async (userId: string, points: number) => {
  console.log(`[ScoreService] Syncing +${points} XP for user ${userId}`);
  // Simulação de delay de rede
  return new Promise((resolve) => setTimeout(resolve, 800));
};
