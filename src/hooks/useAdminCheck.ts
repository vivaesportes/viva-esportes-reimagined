
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useAdminCheck = () => {
  const [adminExiste, setAdminExiste] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);
        
        if (error) {
          console.error('Erro ao verificar admin:', error);
          setError(error.message);
          
          // Retry logic (max 3 attempts)
          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000); // Wait 2 seconds before retry
          }
          return;
        }
        
        if (data && data.length > 0) {
          setAdminExiste(true);
          console.log("Admin já existe no sistema");
        } else {
          setAdminExiste(false);
          console.log("Nenhum admin encontrado, formulário disponível");
        }
      } catch (error: any) {
        console.error('Erro ao verificar admin:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    verificarAdmin();
  }, [retryCount]);

  return { adminExiste, loading, error };
};
