import { useMemo } from 'react';
import { Achievement } from '../types';

export function useAchievements(achievements: Achievement[]) {
  const unlocked = useMemo(() => achievements.filter((item) => item.unlocked), [achievements]);
  const locked = useMemo(() => achievements.filter((item) => !item.unlocked), [achievements]);
  return { unlocked, locked };
}
