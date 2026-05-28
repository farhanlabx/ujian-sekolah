import { useCallback, useMemo } from 'react';

export function useXp(xp: number) {
  const nextLevel = useMemo(() => {
    if (xp < 150) return { level: 1, title: 'Lv.1 AI Trainee', req: 150 };
    if (xp < 400) return { level: 2, title: 'Lv.2 Data Wrangler', req: 400 };
    if (xp < 800) return { level: 3, title: 'Lv.3 Prompt Hacker', req: 800 };
    if (xp < 1300) return { level: 4, title: 'Lv.4 Model Strategist', req: 1300 };
    if (xp < 2000) return { level: 5, title: 'Lv.5 Overfitting Hunter', req: 2000 };
    return { level: 6, title: 'Lv.6 AI Ethicist', req: 3000 };
  }, [xp]);

  const progress = useMemo(() => Math.min(1, xp / nextLevel.req), [xp, nextLevel.req]);

  const addXp = useCallback((amount: number) => {
    return Math.max(0, xp + amount);
  }, [xp]);

  return { nextLevel, progress, addXp };
}
