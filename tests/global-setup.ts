import { FullConfig } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';
import * as readline from 'readline';

dotenvConfig();

async function promptTesterName(): Promise<string | null> {
  if (!process.stdin.isTTY) {
    return null;
  }

  delete process.env.TESTER_NAME;
  delete (global as typeof globalThis & { testerName?: string }).testerName;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string | null>((resolve) => {
    rl.question('Please enter your name (tester name): ', (answer) => {
      rl.close();
      const name = answer.trim();
      if (name) {
        process.env.TESTER_NAME = name;
        (global as typeof globalThis & { testerName: string }).testerName = name;
        resolve(name);
      } else {
        resolve(null);
      }
    });
  });
}

async function promptSheetName(): Promise<string | null> {
  if (!process.stdin.isTTY) {
    return null;
  }

  delete process.env.EXCEL_SHEET_NAME;
  delete (global as typeof globalThis & { excelSheetName?: string }).excelSheetName;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string | null>((resolve) => {
    rl.question(
      'Please enter Excel sheet name (default: Super Admin -  List Admin): ',
      (answer) => {
        rl.close();
        const sheetName = answer.trim();
        if (sheetName) {
          process.env.EXCEL_SHEET_NAME = sheetName;
          (global as typeof globalThis & { excelSheetName: string }).excelSheetName = sheetName;
          resolve(sheetName);
        } else {
          // Use default if empty
          const defaultSheet = 'Super Admin -  List Admin';
          process.env.EXCEL_SHEET_NAME = defaultSheet;
          (global as typeof globalThis & { excelSheetName: string }).excelSheetName = defaultSheet;
          resolve(defaultSheet);
        }
      },
    );
  });
}

async function globalSetup(_config: FullConfig): Promise<void> {
  await promptTesterName();
  await promptSheetName();
  console.log('Global setup completed');
}

export default globalSetup;
