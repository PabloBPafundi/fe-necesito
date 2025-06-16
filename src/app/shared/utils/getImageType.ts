export function isBase64Image(str: string): boolean {
  return !!str && !str.startsWith('http');
}

export function getBase64ImageUrl(base64: string, mimeType = 'image/jpeg'): string {
  return `data:${mimeType};base64,${base64}`;
}
