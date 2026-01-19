
import { createClient } from '@supabase/supabase-js';

// As variáveis do Supabase fornecidas no arquivo .env
const supabaseUrl = 'https://virkjeicsbtjesuzdqcj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcmtqZWljc2J0amVzdXpkcWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3Nzc0MTYsImV4cCI6MjA4NDM1MzQxNn0.Mi667Lc-UytMYB8uAAaP246S-Il9yIhvDHlCTKwGwn8';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Erro Crítico: Credenciais de conexão ausentes.');
}

/**
 * Cliente Supabase centralizado para toda a aplicação Floxhub GPE.
 * Persiste as etapas de planejamento, tarefas e atribuições de squad.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
