
import { useState, useEffect } from 'react';

export const useLoadingTimeout = (loading: boolean) => {
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [longLoadingTimeout, setLongLoadingTimeout] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let longTimeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 3000);
      
      longTimeoutId = setTimeout(() => {
        setLongLoadingTimeout(true);
      }, 10000);
    } else {
      setLoadingTimeout(false);
      setLongLoadingTimeout(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (longTimeoutId) clearTimeout(longTimeoutId);
    };
  }, [loading]);

  return { loadingTimeout, longLoadingTimeout };
};
