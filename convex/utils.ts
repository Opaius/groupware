export function makeDirectKey(a: string, b: string) {
  return [a, b].sort().join("|");
}
