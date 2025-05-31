export function parseActivo(value: any): 0 | 1 | undefined {
  const num = Number(value);
  if (num === 0) return 0;
  if (num === 1) return 1;
  return undefined;
}