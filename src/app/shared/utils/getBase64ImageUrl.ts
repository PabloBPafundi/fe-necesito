export function getBase64ImageUrl(base64: string, mimeType: string = 'image/jpeg'): string {
  if (!base64 || typeof base64 !== 'string') {
    return '';
  }
  return `data:${mimeType};base64,${base64}`;
}