
import { useState, useEffect } from 'react';

export const useCooldown = () => {
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    
    if (cooldown && cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer((prev) => {
          if (prev <= 1) {
            setCooldown(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as number;
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldown, cooldownTimer]);

  const startCooldown = (seconds: number) => {
    setCooldown(true);
    setCooldownTimer(seconds);
  };

  return { cooldown, cooldownTimer, startCooldown };
};
