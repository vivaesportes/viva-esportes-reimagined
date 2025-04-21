
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export const useDatabaseCheck = () => {
  const [databaseCheck, setDatabaseCheck] = useState<string | null>(null);
  const [checkingDatabase, setCheckingDatabase] = useState(false);

  const checkProfileInDatabase = async (user: User | null) => {
    if (!user?.id) {
      setDatabaseCheck("Nenhum usuário autenticado para verificar");
      return;
    }
    
    setCheckingDatabase(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) {
        setDatabaseCheck(`Erro ao verificar perfil: ${error.message}`);
      } else if (!data) {
        setDatabaseCheck("Perfil não encontrado no banco de dados");
      } else {
        setDatabaseCheck(`Perfil encontrado: ${JSON.stringify(data)}`);
      }
    } catch (error: any) {
      setDatabaseCheck(`Erro na verificação: ${error.message}`);
    } finally {
      setCheckingDatabase(false);
    }
  };

  return {
    databaseCheck,
    checkingDatabase,
    checkProfileInDatabase
  };
};
