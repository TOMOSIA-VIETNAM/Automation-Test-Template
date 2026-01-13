import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export const fileUtils = {
  readJSON(filePath: string): unknown {
    try {
      const absolutePath = resolve(process.cwd(), filePath);
      if (!existsSync(absolutePath)) {
        throw new Error(`File not found: ${absolutePath}`);
      }
      const content = readFileSync(absolutePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error reading JSON file ${filePath}:`, errorMessage);
      throw error;
    }
  },
};
