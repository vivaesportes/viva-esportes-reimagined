
import { supabase } from '@/lib/supabase';

export const createDatabaseFunction = async () => {
  try {
    // Verifica se a função já existe
    const { data: functionExists, error: functionCheckError } = await supabase
      .rpc('function_exists', { function_name: 'create_turmas_table' });
      
    if (functionCheckError) {
      console.error('Erro ao verificar existência da função:', functionCheckError);
      return false;
    }
    
    // Se a função não existe, cria
    if (!functionExists) {
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION create_turmas_table()
        RETURNS boolean
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          -- Verifica se a tabela já existe
          IF NOT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'turmas'
          ) THEN
            -- Cria a tabela turmas se não existir
            CREATE TABLE public.turmas (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              nome TEXT NOT NULL,
              modalidade TEXT NOT NULL,
              horario TEXT NOT NULL,
              dia_semana TEXT NOT NULL,
              local TEXT NOT NULL,
              professor_id UUID REFERENCES public.profiles(id),
              created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            
            -- Adiciona políticas de segurança (RLS)
            ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
            
            -- Política que permite a todos os usuários visualizar todas as turmas
            CREATE POLICY "Todos podem visualizar turmas" 
              ON public.turmas 
              FOR SELECT 
              USING (true);
            
            -- Política que permite apenas aos administradores inserir, atualizar ou excluir turmas
            CREATE POLICY "Apenas admins podem modificar turmas" 
              ON public.turmas 
              FOR ALL
              USING (
                EXISTS (
                  SELECT 1 FROM public.profiles
                  WHERE profiles.id = auth.uid()
                  AND profiles.role = 'admin'
                )
              );
            
            RETURN true;
          ELSE
            RETURN false;
          END IF;
        END;
        $$;
      `;
      
      // Executa o SQL para criar a função
      const { error: createFunctionError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
      
      if (createFunctionError) {
        console.error('Erro ao criar função do banco de dados:', createFunctionError);
        return false;
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
    return false;
  }
};

// Função auxiliar para verificar se uma função existe
export const createHelperFunctions = async () => {
  try {
    const functionExistsSQL = `
      CREATE OR REPLACE FUNCTION function_exists(function_name text)
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1
          FROM pg_proc p
          JOIN pg_namespace n ON p.pronamespace = n.oid
          WHERE n.nspname = 'public'
          AND p.proname = function_name
        );
      END;
      $$;
    `;
    
    const execSqlSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$;
    `;
    
    // Executa os SQLs para criar as funções auxiliares
    await supabase.rpc('exec_sql', { sql: functionExistsSQL });
    await supabase.rpc('exec_sql', { sql: execSqlSQL });
    
    return true;
  } catch (error) {
    console.error('Erro ao criar funções auxiliares:', error);
    return false;
  }
};
