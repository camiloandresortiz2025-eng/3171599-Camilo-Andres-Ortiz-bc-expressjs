import { readFile } from 'fs/promises';
import { join } from 'path';
import type { CateringEvent } from './types.js';

export async function readItems(): Promise<CateringEvent[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'catering-events.json');
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as CateringEvent[];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`No se pudo leer el archivo de datos: ${message}`);
  }
}
