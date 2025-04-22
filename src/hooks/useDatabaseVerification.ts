
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
        
        // Step 1: Verify if the delete_user function exists
        const { data: funcExists, error: funcError } = await supabase.rpc('function_exists', {
          function_name: 'delete_user'
        });
        
        if (funcError) {
          console.log('Error checking function existence:', funcError);
          // Continue with table checks
        }
        
        if (!funcExists) {
          console.log('Creating delete_user function...');
          const { error: createFuncError } = await supabase.rpc('create_delete_user_function');
          
          if (createFuncError) {
            console.error('Error creating delete_user function:', createFuncError);
          }
        }
        
        // Step 2: Verify if the turmas table exists
        const { data: tableExists, error: tableError } = await supabase
          .from('turmas')
          .select('id')
          .limit(1);
          
        if (tableError) {
          // If there's an error, the table might not exist, so try to create it
          if (tableError.code === '42P01') { // code for non-existent table
            console.log('Table turmas not found, creating...');
            
            // Create the turmas table
            const { error: createError } = await supabase.rpc('create_turmas_table');
            
            if (createError) {
              console.error('Error creating turmas table:', createError);
              toast({
                title: "Database initialization error",
                description: "Could not set up the database. Please contact support.",
                variant: "destructive",
              });
              return;
            }
            
            toast({
              title: "Database initialized",
              description: "The system has been successfully configured.",
            });
          } else {
            // If it's another error, just report it
            console.error('Error checking turmas table:', tableError);
          }
        }
        
        setIsVerified(true);
      } catch (error) {
        console.error('Error verifying database:', error);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyDatabase();
  }, []);
  
  return { isVerified, isVerifying };
};
