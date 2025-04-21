
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useAdminCheck = () => {
  const [adminExiste, setAdminExiste] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);
        
        if (error) {
          console.error('Erro ao verificar admin:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setAdminExiste(true);
          console.log("Admin já existe no sistema");
        } else {
          console.log("Nenhum admin encontrado, formulário disponível");
        }
      } catch (error) {
        console.error('Erro ao verificar admin:', error);
      } finally {
        setLoading(false);
      }
    };

    verificarAdmin();
  }, []);

  return { adminExiste, loading };
};
