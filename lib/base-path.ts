/**
 * Pfad-Präfix für GitHub Pages (z. B. "/huepfburg-verleih"). Bei normalem Betrieb leer.
 * Next.js setzt das Präfix für <Link> und den Router selbst; für Bilder, Formular-Ziele
 * und Icons muss es mit withBasePath() ergänzt werden.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function withBasePath(path: string): string {
  return path.startsWith('/') ? `${basePath}${path}` : path
}
