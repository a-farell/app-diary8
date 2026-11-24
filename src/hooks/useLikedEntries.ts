import { useMemo } from 'react';
import type { DiaryEntry } from '../features/diary/diarySlice';

// Derived state: daftar favorite dihitung dari entries (flag `liked`),
// bukan disimpan sebagai state terpisah.
export function useLikedEntries(entries: DiaryEntry[]) {
  return useMemo(() => entries.filter((entry) => entry.liked), [entries]);
}
