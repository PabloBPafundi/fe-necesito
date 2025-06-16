export function cleanEscapedUrl(escapedUrl: string): string {
  if (!escapedUrl) return '';
  const cleaned = escapedUrl.replace(/\\/g, '');
  return cleaned;
}