
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
        
        // Verificar diretamente no banco de dados via REST API para evitar problemas de RLS
        const SUPABASE_URL = "https://tgxmuqvwwkxugvyspcwn.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneG11cXZ3d2t4dWd2eXNwY3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA1MDUsImV4cCI6MjA2MDgzNjUwNX0.dImvfAModlvq8rqduR_5FOy-K4vDF22ko_uy6OiRc-0";
        
        try {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?role=eq.admin&select=id&limit=1`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`Erro ao verificar admin: ${response.statusText}`);
          }
          
          const data = await response.json();
          
          if (data && data.length > 0) {
            setAdminExiste(true);
            console.log("Admin já existe no sistema");
          } else {
            setAdminExiste(false);
            console.log("Nenhum admin encontrado, formulário disponível");
          }
        } catch (fetchError: any) {
          console.error('Erro ao fazer requisição REST:', fetchError);
          throw fetchError;
        }
      } catch (error: any) {
        console.error('Erro ao verificar admin:', error);
        setError(error.message);
        
        // Retry logic (max 3 attempts)
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000); // Wait 2 seconds before retry
        }
      } finally {
        setLoading(false);
      }
    };

    verificarAdmin();
  }, [retryCount]);

  return { adminExiste, loading, error };
};
