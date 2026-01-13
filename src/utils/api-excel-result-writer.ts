import { resolve } from 'path';
import { TestInfo } from '@playwright/test';
import { createRequire } from 'module';
import type ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

const require = createRequire(import.meta.url);
const ExcelJSModule = require('exceljs');

interface APIExcelResultWriterConfig {
  excelFilePath: string;
  sheetName: string;
  headerRowIndex: number;
}

interface RunCountData {
  runCount: number;
  lastUpdated: string;
}

/**
 * API Excel Result Writer
 * Writes API test results to api_testcases.xlsx with rotating Result 1/Result 2 logic
 *
 * Logic:
 * - Run 1, 3, 5... → Write to Result 1 columns
 * - Run 2, 4, 6... → Write to Result 2 columns
 */
class APIExcelResultWriter {
  private config: APIExcelResultWriterConfig;
  private excelPath: string;
  private trackerDir: string;
  private runCountFilePath: string;

  constructor(config: APIExcelResultWriterConfig) {
    this.config = config;
    this.excelPath = resolve(process.cwd(), config.excelFilePath);
    this.trackerDir = resolve(process.cwd(), '.playwright-test-tracker');
    this.runCountFilePath = path.join(this.trackerDir, 'api-run-count.json');

    // Create tracker directory if it doesn't exist
    if (!fs.existsSync(this.trackerDir)) {
      fs.mkdirSync(this.trackerDir, { recursive: true });
    }
  }

  /**
   * Acquire file lock to prevent concurrent writes
   */
  private async acquireLock(): Promise<() => void> {
    const lockFilePath = path.join(this.trackerDir, '.api-excel-write.lock');
    const maxRetries = 100;
    const retryDelay = 100;

    for (let i = 0; i < maxRetries; i++) {
      try {
        fs.writeFileSync(lockFilePath, String(process.pid), { flag: 'wx' });
        return () => {
          try {
            if (fs.existsSync(lockFilePath)) {
              const currentPid = fs.readFileSync(lockFilePath, 'utf-8');
              if (currentPid === String(process.pid)) {
                fs.unlinkSync(lockFilePath);
              }
            }
          } catch (error) {
            console.warn(`[API Excel] Failed to release lock: ${error}`);
          }
        };
      } catch {
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay + Math.random() * 50));

          try {
            if (fs.existsSync(lockFilePath)) {
              const stats = fs.statSync(lockFilePath);
              const lockAge = Date.now() - stats.mtimeMs;
              if (lockAge > 30000) {
                console.warn(`[API Excel] Removing stale lock file (age: ${lockAge}ms)`);
                fs.unlinkSync(lockFilePath);
              }
            }
          } catch {
            // Ignore errors
          }
        }
      }
    }

    throw new Error('Failed to acquire API Excel write lock after maximum retries');
  }

  /**
   * Get tester name from environment or global
   */
  private getTesterName(): string {
    const envTesterName = process.env.TESTER_NAME;
    const globalTesterName = (global as typeof globalThis & { testerName?: string }).testerName;
    return envTesterName || globalTesterName || 'Automation';
  }

  /**
   * Extract test case ID from test tags (format: @TC_XXX)
   */
  private extractTestCaseId(testInfo: TestInfo): string | null {
    const tags = testInfo.tags || [];
    console.log(`[API Excel] Extracting test case ID from tags: ${JSON.stringify(tags)}`);

    // Find tag starting with @TC_
    const tcTag = tags.find((tag) => tag.startsWith('@TC_'));
    if (tcTag) {
      const testCaseId = tcTag.substring(1); // Remove @ prefix
      console.log(`[API Excel] Found test case ID: ${testCaseId}`);
      return testCaseId;
    }

    console.log('[API Excel] No test case ID found in tags');
    return null;
  }

  /**
   * Read run count data from tracker file
   */
  private readRunCountData(): RunCountData {
    try {
      if (fs.existsSync(this.runCountFilePath)) {
        const data = fs.readFileSync(this.runCountFilePath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn(`[API Excel] Failed to read run count: ${error}`);
    }
    return { runCount: 0, lastUpdated: '' };
  }

  /**
   * Write run count data to tracker file
   */
  private writeRunCountData(data: RunCountData): void {
    try {
      fs.writeFileSync(this.runCountFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.warn(`[API Excel] Failed to write run count: ${error}`);
    }
  }

  /**
   * Get current run number (1 or 2) based on run count
   * Odd runs (1, 3, 5...) → Result 1
   * Even runs (2, 4, 6...) → Result 2
   */
  public getRunNumber(): 1 | 2 {
    const data = this.readRunCountData();
    // runCount starts at 0, after first run it becomes 1
    // Run 1, 3, 5... → Result 1 (runCount 1, 3, 5... means odd → Result 1)
    // Run 2, 4, 6... → Result 2 (runCount 2, 4, 6... means even → Result 2)
    return data.runCount % 2 === 0 ? 1 : 2;
  }

  /**
   * Increment run count (call this at the start of a test suite run)
   */
  public incrementRunCount(): number {
    const data = this.readRunCountData();
    data.runCount++;
    data.lastUpdated = new Date().toISOString();
    this.writeRunCountData(data);
    console.log(
      `[API Excel] Run count incremented to ${data.runCount}, writing to Result ${this.getRunNumber()}`,
    );
    return data.runCount;
  }

  /**
   * Reset run count to 0
   */
  public resetRunCount(): void {
    this.writeRunCountData({ runCount: 0, lastUpdated: new Date().toISOString() });
    console.log('[API Excel] Run count reset to 0');
  }

  /**
   * Find row by test case ID in the worksheet
   */
  private findRowByTestCaseId(
    worksheet: ExcelJS.Worksheet,
    testCaseId: string,
    headerRowIndex: number,
  ): number | null {
    const idColumnIndex = 1; // Column A (ID column)
    const startRow = headerRowIndex + 1; // Data starts after header
    const maxRows = worksheet.rowCount || 100;

    for (let rowNum = startRow; rowNum <= maxRows; rowNum++) {
      const row = worksheet.getRow(rowNum);
      const cell = row.getCell(idColumnIndex);

      if (cell && cell.value) {
        const cellValue = String(cell.value).trim();
        if (cellValue === testCaseId || cellValue.toUpperCase() === testCaseId.toUpperCase()) {
          console.log(`[API Excel] Found test case ${testCaseId} at row ${rowNum}`);
          return rowNum;
        }
      }
    }

    console.warn(`[API Excel] Test case ID "${testCaseId}" not found in worksheet`);
    return null;
  }

  /**
   * Get column indices for Result 1 and Result 2
   * Based on Excel structure:
   * - Result 1: EXECUTION_STATUS (L), NOTE/BUG (M), EXECUTE_BY (N), EXECUTE_DATE (O)
   * - Result 2: EXECUTION_STATUS (P), NOTE/BUG (Q), EXECUTE_BY (R), EXECUTE_DATE (S)
   */
  private getResultColumns(roundNumber: 1 | 2): {
    statusCol: number;
    noteCol: number;
    testerCol: number;
    dateCol: number;
  } {
    if (roundNumber === 1) {
      return {
        statusCol: 12, // Column L (EXECUTION_STATUS for Result 1)
        noteCol: 13, // Column M (NOTE/BUG for Result 1)
        testerCol: 14, // Column N (EXECUTE_BY for Result 1)
        dateCol: 15, // Column O (EXECUTE_DATE for Result 1)
      };
    } else {
      return {
        statusCol: 16, // Column P (EXECUTION_STATUS for Result 2)
        noteCol: 17, // Column Q (NOTE/BUG for Result 2)
        testerCol: 18, // Column R (EXECUTE_BY for Result 2)
        dateCol: 19, // Column S (EXECUTE_DATE for Result 2)
      };
    }
  }

  /**
   * Write test result to Excel file
   */
  async writeResult(testInfo: TestInfo): Promise<void> {
    const testCaseId = this.extractTestCaseId(testInfo);
    if (!testCaseId) {
      console.log('[API Excel] Skipping Excel write - no test case ID found');
      return;
    }

    const status =
      testInfo.status === 'passed' ? 'Pass' : testInfo.status === 'failed' ? 'Fail' : '';
    if (!status) {
      console.log('[API Excel] Skipping Excel write - test status is not passed or failed');
      return;
    }

    console.log(`[API Excel] Writing result for test case: ${testCaseId}, Status: ${status}`);

    const releaseLock = await this.acquireLock();

    try {
      const workbook = new ExcelJSModule.Workbook();

      // Read Excel file with retries
      let retries = 5;
      let readSuccess = false;

      while (retries > 0 && !readSuccess) {
        try {
          await workbook.xlsx.readFile(this.excelPath);
          readSuccess = true;
        } catch (error) {
          retries--;
          if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          } else {
            releaseLock();
            throw error;
          }
        }
      }

      // Get worksheet
      const worksheet = workbook.getWorksheet(this.config.sheetName);
      if (!worksheet) {
        const sheetNames = workbook.worksheets.map((ws: ExcelJS.Worksheet) => ws.name);
        console.warn(
          `[API Excel] Worksheet "${this.config.sheetName}" not found. Available: ${JSON.stringify(sheetNames)}`,
        );
        releaseLock();
        return;
      }

      // Find row for this test case
      const rowIndex = this.findRowByTestCaseId(worksheet, testCaseId, this.config.headerRowIndex);
      if (rowIndex === null) {
        console.warn(`[API Excel] Could not find row for test case ID: ${testCaseId}`);
        releaseLock();
        return;
      }

      // Get current run number (1 or 2)
      const runNumber = this.getRunNumber();
      const columns = this.getResultColumns(runNumber);

      console.log(`[API Excel] Writing to Result ${runNumber} columns for ${testCaseId}`);

      // Get row and write data
      const row = worksheet.getRow(rowIndex);

      // Write EXECUTION_STATUS
      const statusCell = row.getCell(columns.statusCol);
      statusCell.value = status;

      // Write EXECUTE_BY
      const testerCell = row.getCell(columns.testerCol);
      testerCell.value = this.getTesterName();

      // Write EXECUTE_DATE
      const dateCell = row.getCell(columns.dateCol);
      const today = new Date();
      const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      dateCell.value = dateString;

      // Write NOTE/BUG (empty for pass, error message for fail)
      const noteCell = row.getCell(columns.noteCol);
      if (status === 'Fail' && testInfo.error) {
        noteCell.value = testInfo.error.message?.substring(0, 200) || 'Test failed';
      } else {
        noteCell.value = '';
      }

      // Save file with retries
      let writeRetries = 5;
      let writeSuccess = false;

      while (writeRetries > 0 && !writeSuccess) {
        try {
          await workbook.xlsx.writeFile(this.excelPath);
          writeSuccess = true;
          console.log(
            `[API Excel] Successfully wrote result for ${testCaseId} to Result ${runNumber}`,
          );
        } catch (error) {
          writeRetries--;
          if (writeRetries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          } else {
            releaseLock();
            throw error;
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`[API Excel] Failed to write result: ${errorMessage}`);
    } finally {
      releaseLock();
    }
  }
}

// Default configuration for API tests
const getDefaultConfig = (): APIExcelResultWriterConfig => {
  return {
    excelFilePath: 'excel/api_testcases.xlsx',
    sheetName: 'API_testing',
    headerRowIndex: 5, // Header is at row 6 (0-indexed = 5)
  };
};

// Export singleton instance
export const apiExcelResultWriter = new APIExcelResultWriter(getDefaultConfig());

// Export factory function for custom configuration
export const createAPIExcelResultWriter = (config: Partial<APIExcelResultWriterConfig>) => {
  return new APIExcelResultWriter({ ...getDefaultConfig(), ...config });
};
