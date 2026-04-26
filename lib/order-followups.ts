export function pendingDayMarks(daysSinceCreated: number, alreadySent: number[]) {
  const candidates = [1, 3, 7];
  const sent = new Set(alreadySent);
  return candidates.filter((d) => daysSinceCreated >= d && !sent.has(d));
}
