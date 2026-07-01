
import { createClient } from '@supabase/supabase-js';

// As variáveis do Supabase fornecidas no arquivo .env
const supabaseUrl = 'https://qhexnyodebmozxvfklnm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZXhueW9kZWJtb3p4dmZrbG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MDM0MDYsImV4cCI6MjA5ODQ3OTQwNn0.njKrx1nSjV74s63-ye1VCtgEGQQqrR7nYoT94udoR3I';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Erro Crítico: Credenciais de conexão ausentes.');
}

/**
 * Cliente Supabase centralizado para toda a aplicação Floxhub GPE.
 * Persiste as etapas de planejamento, tarefas e atribuições de squad.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
