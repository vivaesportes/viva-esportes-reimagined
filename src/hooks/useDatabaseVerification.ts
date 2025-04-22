
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const useDatabaseVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyDatabase = async () => {
      try {
        setIsVerifying(true);
        
        // Verifica se a tabela 'turmas' existe
        const { data: tableExists, error: tableError } = await supabase
          .from('turmas')
          .select('id')
          .limit(1);
          
        if (tableError) {
          // Se der erro, provavelmente a tabela não existe, então tenta criar
          if (tableError.code === '42P01') { // código para tabela não existente
            console.log('Tabela turmas não encontrada, criando...');
            
            // Cria a tabela 'turmas'
            const { error: createError } = await supabase.rpc('create_turmas_table');
            
            if (createError) {
              console.error('Erro ao criar tabela turmas:', createError);
              toast({
                title: "Erro de inicialização",
                description: "Não foi possível configurar o banco de dados. Entre em contato com o suporte.",
                variant: "destructive",
              });
              return;
            }
            
            toast({
              title: "Banco de dados inicializado",
              description: "O sistema foi configurado com sucesso.",
            });
          } else {
            // Se for outro erro, apenas informa
            console.error('Erro ao verificar tabela turmas:', tableError);
          }
        }
        
        setIsVerified(true);
      } catch (error) {
        console.error('Erro ao verificar banco de dados:', error);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyDatabase();
  }, []);
  
  return { isVerified, isVerifying };
};
