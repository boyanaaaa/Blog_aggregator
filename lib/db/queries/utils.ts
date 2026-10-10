export function firstOrUndefined<T>(items: T[]): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return items[0];
}
