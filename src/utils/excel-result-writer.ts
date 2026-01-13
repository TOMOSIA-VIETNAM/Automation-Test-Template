import { resolve } from 'path';
import { TestInfo } from '@playwright/test';
import { createRequire } from 'module';
import type ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

const require = createRequire(import.meta.url);
const ExcelJSModule = require('exceljs');

interface ExcelResultWriterConfig {
  excelFilePath: string;
  sheetName: string;
  headerRowIndex: number;
}

interface TestRunTrackerData {
  count: number;
  totalProjects: number;
  results: Record<string, { status: string; projectName: string }>;
}

class ExcelResultWriter {
  private config: ExcelResultWriterConfig;
  private excelPath: string;
  private trackerDir: string;

  constructor(config: ExcelResultWriterConfig) {
    this.config = config;
    this.excelPath = resolve(process.cwd(), config.excelFilePath);
    this.trackerDir = resolve(process.cwd(), '.playwright-test-tracker');

    // Create tracker directory if it doesn't exist
    if (!fs.existsSync(this.trackerDir)) {
      fs.mkdirSync(this.trackerDir, { recursive: true });
    }
  }

  private async acquireLock(): Promise<() => void> {
    const lockFilePath = path.join(this.trackerDir, '.excel-write.lock');
    const maxRetries = 100;
    const retryDelay = 100;

    // Wait until lock file can be created
    for (let i = 0; i < maxRetries; i++) {
      try {
        // Try to create lock file with 'wx' flag (write exclusive - fail if file already exists)
        fs.writeFileSync(lockFilePath, String(process.pid), { flag: 'wx' });

        // Return function to release lock
        return () => {
          try {
            if (fs.existsSync(lockFilePath)) {
              const currentPid = fs.readFileSync(lockFilePath, 'utf-8');
              // Only delete if lock file belongs to this process
              if (currentPid === String(process.pid)) {
                fs.unlinkSync(lockFilePath);
              }
            }
          } catch (error) {
            console.warn(`[DEBUG] Failed to release lock: ${error}`);
          }
        };
      } catch {
        // Lock file already exists, wait and retry
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay + Math.random() * 50));

          // Check if lock file is stale (exists too long)
          try {
            if (fs.existsSync(lockFilePath)) {
              const stats = fs.statSync(lockFilePath);
              const lockAge = Date.now() - stats.mtimeMs;
              // If lock file exists for more than 30 seconds, consider it stale and remove
              if (lockAge > 30000) {
                console.warn(`[DEBUG] Removing stale lock file (age: ${lockAge}ms)`);
                fs.unlinkSync(lockFilePath);
              }
            }
          } catch {
            // Ignore errors when checking stale lock file
          }
        }
      }
    }

    // If lock cannot be acquired after maxRetries attempts
    throw new Error('Failed to acquire Excel write lock after maximum retries');
  }

  private getTesterName(): string | null {
    const envTesterName = process.env.TESTER_NAME;
    const globalTesterName = (global as typeof globalThis & { testerName?: string }).testerName;
    const testerName = envTesterName || globalTesterName || null;

    return testerName;
  }

  private extractTestCaseId(testInfo: TestInfo): string | null {
    const tags = testInfo.tags || [];
    console.log(`[DEBUG] Extracting test case ID from tags: ${JSON.stringify(tags)}`);

    // Try format @TC_* (old format)
    const tcTag = tags.find((tag) => tag.startsWith('@TC_'));
    if (tcTag) {
      const testCaseId = tcTag.substring(1);
      console.log(`[DEBUG] Found TC_ format test case ID: ${testCaseId}`);
      return testCaseId;
    }

    // Try format @AM_FL_EM_001 or @am_fl_em_001 (new format from Excel)
    // Pattern: @ followed by uppercase letters, numbers, and underscores
    // Exclude common tags like @smoke, @regression, @filter, etc.
    const commonTags = [
      '@smoke',
      '@regression',
      '@ui',
      '@filter',
      '@table',
      '@action',
      '@login',
      '@happy-path',
      '@ui-validation',
      '@super-admin-list-admin',
    ];

    const testCaseIdTag = tags.find((tag) => {
      if (commonTags.includes(tag.toLowerCase())) {
        return false;
      }
      // Match pattern: @ followed by letters/numbers/underscores/hyphens (test case ID format)
      // Examples: @AM_FL_EM_001, @am_fl_em_001, @AM_TBL_SRT_001, @A001-LOGIN_002
      const tagWithoutAt = tag.substring(1);
      const testCaseIdPattern = /^[A-Z0-9_-]+$/i;
      return testCaseIdPattern.test(tagWithoutAt) && tagWithoutAt.length >= 5;
    });

    if (testCaseIdTag) {
      // Convert to uppercase to match Excel format
      const testCaseId = testCaseIdTag.substring(1).toUpperCase();
      console.log(`[DEBUG] Found test case ID: ${testCaseId} from tag: ${testCaseIdTag}`);
      return testCaseId;
    }

    console.log('[DEBUG] No test case ID found in tags');
    return null;
  }

  private generateAutoMethodName(testInfo: TestInfo): string {
    try {
      const testTitle = testInfo.title || '';
      const testFile = testInfo.file || '';

      let methodName = '';

      if (testFile) {
        const fileName = testFile.split('/').pop() || '';
        const caseFolderMatch = testFile.match(/case-\d+-(.+?)\//);
        if (caseFolderMatch && caseFolderMatch[1]) {
          const caseName = caseFolderMatch[1];
          const words = caseName.split('-');
          const camelCase = words
            .map((word, index) =>
              index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
            )
            .join('');
          methodName = `test${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}()`;
        } else {
          const fileBaseName = fileName.replace('.spec.ts', '').replace('.spec.js', '');
          const words = fileBaseName.split(/[-_]/);
          const camelCase = words
            .map((word, index) =>
              index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
            )
            .join('');
          methodName = `test${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}()`;
        }
      }

      if (!methodName && testTitle) {
        const words = testTitle
          .toLowerCase()
          .replace(/should\s+/i, '')
          .replace(/when\s+/i, '')
          .split(/\s+/)
          .filter((word) => word.length > 0);

        const camelCase = words
          .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
          .join('');

        methodName = `test${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}()`;
      }

      return methodName || 'test()';
    } catch {
      return 'test()';
    }
  }

  private extractFolderName(testInfo: TestInfo): string | null {
    try {
      const testFile = testInfo.file || '';
      if (!testFile) {
        return null;
      }

      const caseFolderMatch = testFile.match(/case-\d+-(.+?)\//);
      if (caseFolderMatch && caseFolderMatch[1]) {
        const fullCaseFolderMatch = testFile.match(/(case-\d+-.+?)\//);
        if (fullCaseFolderMatch && fullCaseFolderMatch[1]) {
          return fullCaseFolderMatch[1];
        }
      }

      const pathParts = testFile.split('/');
      const casesIndex = pathParts.findIndex((part) => part === 'cases');
      if (casesIndex !== -1 && casesIndex < pathParts.length - 1) {
        return pathParts[casesIndex + 1];
      }

      return null;
    } catch {
      return null;
    }
  }

  private findColumnIndex(headers: string[], searchText: string): number {
    return headers.findIndex((header) => {
      const headerStr = String(header).toLowerCase();
      const searchLower = searchText.toLowerCase();
      return headerStr.includes(searchLower) || headerStr.includes('Result 1');
    });
  }

  private findRowByTestCaseId(
    worksheet: ExcelJS.Worksheet,
    headers: string[],
    testCaseId: string,
  ): number | null {
    const testCaseIdColumnIndex = this.findColumnIndex(headers, 'test case id');
    if (testCaseIdColumnIndex === -1) {
      console.warn(
        `[DEBUG] Test case ID column not found. Headers: ${JSON.stringify(headers.slice(0, 15))}`,
      );
      return null;
    }

    const headerRowIndex = this.config.headerRowIndex;
    const testCaseIdColumn = testCaseIdColumnIndex + 1;

    // headerRowIndex is 0-based (row 8 in Excel = index 7)
    // Test cases start at row 9 in Excel (1-based) = index 8 (0-based)
    // So we should start from headerRowIndex + 1
    let rowNum = headerRowIndex + 1;
    const maxRows = worksheet.rowCount || 1000;

    for (; rowNum <= maxRows; rowNum++) {
      const row = worksheet.getRow(rowNum);
      if (!row || row.number === 0) {
        break;
      }
      const cell = row.getCell(testCaseIdColumn);
      if (cell && cell.value) {
        const cellValue = String(cell.value).trim();
        if (cellValue === testCaseId || cellValue.toUpperCase() === testCaseId.toUpperCase()) {
          return rowNum;
        }
      }
      if (rowNum > headerRowIndex + 30) {
        break;
      }
    }
    console.warn(`[DEBUG] Test case ID "${testCaseId}" not found in any row`);
    return null;
  }

  private hasRound1Data(
    _worksheet: ExcelJS.Worksheet,
    row: ExcelJS.Row,
    headers: string[],
    result1ColumnIndex: number,
  ): boolean {
    const result1Column = result1ColumnIndex + 1;
    const result1Cell = row.getCell(result1Column);
    if (result1Cell && result1Cell.value) {
      const resultValue = String(result1Cell.value).trim();
      if (resultValue && (resultValue === 'P' || resultValue === 'F')) {
        return true;
      }
    }

    const round1StartIndex = 15;
    const round1EndIndex = 19;

    const date1ColumnIndex = headers.findIndex((header, index) => {
      const headerStr = String(header).toLowerCase();
      const isDateColumn =
        (headerStr.includes('date') || headerStr.includes('試験日')) &&
        !headerStr.includes('result 2');
      return isDateColumn && index >= round1StartIndex && index <= round1EndIndex;
    });

    if (date1ColumnIndex !== -1) {
      const date1Cell = row.getCell(date1ColumnIndex + 1);
      if (date1Cell && date1Cell.value) {
        const dateValue = String(date1Cell.value).trim();
        if (dateValue && dateValue !== '(empty)' && dateValue !== '') {
          return true;
        }
      }
    }

    const tester1ColumnIndex = headers.findIndex((header, index) => {
      const headerStr = String(header).toLowerCase();
      return (
        (headerStr.includes('tester') || headerStr.includes('担当者')) &&
        !headerStr.includes('result 2') &&
        index >= round1StartIndex &&
        index <= round1EndIndex
      );
    });

    if (tester1ColumnIndex !== -1) {
      const tester1Cell = row.getCell(tester1ColumnIndex + 1);
      if (tester1Cell && tester1Cell.value) {
        const testerValue = String(tester1Cell.value).trim();
        if (testerValue && testerValue !== '(empty)' && testerValue !== '') {
          return true;
        }
      }
    }

    return false;
  }

  private writeRoundData(
    row: ExcelJS.Row,
    headers: string[],
    status: string,
    testCaseId: string,
    _testInfo: TestInfo,
    roundNumber: 1 | 2,
  ): void {
    const result1ColumnIndex = headers.findIndex((header) => {
      const headerStr = String(header).toLowerCase();
      return (
        (headerStr.includes('result') && headerStr.includes('1')) ||
        (headerStr.includes('結果') && headerStr.includes('Result 1'))
      );
    });

    const roundStartIndex = roundNumber === 1 ? 15 : 20;
    const roundEndIndex = roundNumber === 1 ? 19 : 24;

    const dateColumnIndex = headers.findIndex((header, index) => {
      const headerStr = String(header).toLowerCase();
      const isDateColumn =
        (headerStr.includes('date') || headerStr.includes('試験日')) &&
        !(roundNumber === 1 && headerStr.includes('result 2'));
      return isDateColumn && index >= roundStartIndex && index <= roundEndIndex;
    });

    if (dateColumnIndex !== -1) {
      const dateColumn = dateColumnIndex + 1;
      const dateCell = row.getCell(dateColumn);
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      dateCell.value = dateString;
      dateCell.numFmt = 'yyyy-mm-dd';
    }

    const testerColumnIndex = headers.findIndex((header, index) => {
      const headerStr = String(header).toLowerCase();
      return (
        (headerStr.includes('tester') || headerStr.includes('担当者')) &&
        !(roundNumber === 1 && headerStr.includes('result 2')) &&
        index >= roundStartIndex &&
        index <= roundEndIndex
      );
    });

    if (testerColumnIndex !== -1) {
      const testerName = this.getTesterName();
      if (testerName) {
        const testerColumn = testerColumnIndex + 1;
        const testerCell = row.getCell(testerColumn);
        testerCell.value = testerName;
      } else {
        console.warn(`No tester name found for ${testCaseId}`);
      }
    }

    const resultColumnIndex = headers.findIndex((header, index) => {
      const headerStr = String(header).toLowerCase();
      if (roundNumber === 1) {
        return (
          (headerStr.includes('result') && headerStr.includes('1')) ||
          (headerStr.includes('結果') && headerStr.includes('Result 1'))
        );
      } else {
        return (
          ((headerStr.includes('result') && headerStr.includes('2')) ||
            (headerStr.includes('結果') && headerStr.includes('Result 2'))) &&
          index >= roundStartIndex &&
          index <= roundEndIndex
        );
      }
    });

    if (resultColumnIndex !== -1) {
      const resultColumn = resultColumnIndex + 1;
      const resultCell = row.getCell(resultColumn);
      resultCell.value = status;
    }

    const reportLinkColumnIndex = headers.findIndex((header, index) => {
      const headerStr = String(header).toLowerCase();
      const isReportLink =
        (headerStr.includes('report') && headerStr.includes('link')) ||
        headerStr.includes('レポートへのリンク');
      if (roundNumber === 1) {
        return isReportLink && index > result1ColumnIndex && index < result1ColumnIndex + 5;
      } else {
        return isReportLink && index >= roundStartIndex && index <= roundEndIndex;
      }
    });

    if (reportLinkColumnIndex !== -1) {
      const reportBaseUrl = process.env.PLAYWRIGHT_REPORT_URL || 'http://localhost:9323';
      const reportLink = `${reportBaseUrl}/#?q=@${testCaseId}`;

      const reportLinkColumn = reportLinkColumnIndex + 1;
      const reportLinkCell = row.getCell(reportLinkColumn);
      reportLinkCell.value = {
        text: reportLink,
        hyperlink: reportLink,
      };
    } else {
      console.warn(`Report Link column not found for Round ${roundNumber} (${testCaseId})`);
    }
  }

  private getTotalProjectCount(): number {
    // Get project count from environment variable or default to 3 (chromium, firefox, webkit)
    const projectCount = process.env.PLAYWRIGHT_PROJECT_COUNT;
    if (projectCount) {
      return parseInt(projectCount, 10);
    }
    // Default to 3 browsers
    return 3;
  }

  private getTrackerFilePath(testCaseId: string): string {
    return path.join(this.trackerDir, `${testCaseId}.json`);
  }

  private readTrackerData(testCaseId: string): TestRunTrackerData | null {
    const trackerPath = this.getTrackerFilePath(testCaseId);
    try {
      if (fs.existsSync(trackerPath)) {
        const data = fs.readFileSync(trackerPath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn(`[DEBUG] Failed to read tracker for ${testCaseId}:`, error);
    }
    return null;
  }

  private writeTrackerData(testCaseId: string, data: TestRunTrackerData): void {
    const trackerPath = this.getTrackerFilePath(testCaseId);
    try {
      fs.writeFileSync(trackerPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.warn(`[DEBUG] Failed to write tracker for ${testCaseId}:`, error);
    }
  }

  private deleteTrackerData(testCaseId: string): void {
    const trackerPath = this.getTrackerFilePath(testCaseId);
    try {
      if (fs.existsSync(trackerPath)) {
        fs.unlinkSync(trackerPath);
      }
    } catch (error) {
      console.warn(`[DEBUG] Failed to delete tracker for ${testCaseId}:`, error);
    }
  }

  private isLastRun(testCaseId: string, _projectName: string): boolean {
    const tracker = this.readTrackerData(testCaseId);
    if (!tracker) {
      return false;
    }

    return tracker.count >= tracker.totalProjects;
  }

  async writeResult(testInfo: TestInfo): Promise<void> {
    const testCaseId = this.extractTestCaseId(testInfo);
    if (!testCaseId) {
      console.log('[DEBUG] Skipping Excel write - no test case ID found');
      return;
    }

    console.log(`[DEBUG] Writing result for test case: ${testCaseId}`);
    console.log(`[DEBUG] Test status: ${testInfo.status}`);
    console.log(`[DEBUG] Project name: ${testInfo.project.name}`);

    const status = testInfo.status === 'passed' ? 'P' : testInfo.status === 'failed' ? 'F' : '';
    if (!status) {
      console.log('[DEBUG] Skipping Excel write - test status is not passed or failed');
      return;
    }

    const projectName = testInfo.project.name || 'unknown';

    // Read or create tracker data
    let tracker = this.readTrackerData(testCaseId);
    if (!tracker) {
      tracker = {
        count: 0,
        totalProjects: this.getTotalProjectCount(),
        results: {},
      };
    }

    // Check if this project has already run
    if (tracker.results[projectName]) {
      console.log(`[DEBUG] Project ${projectName} already run for ${testCaseId}`);
      // Still check if all runs are completed and we need to write to Excel
      if (this.isLastRun(testCaseId, projectName)) {
        console.log(`[DEBUG] This is the last run, writing to Excel...`);
        // Get final status: 'F' if any run failed, otherwise 'P'
        const allStatuses = Object.values(tracker.results).map((r) => r.status);
        const finalStatus = allStatuses.includes('F') ? 'F' : 'P';
        await this.writeToExcelInternal(testInfo, testCaseId, finalStatus);
      }
      return;
    }

    // Save result of this run
    tracker.count++;
    tracker.results[projectName] = { status, projectName };
    console.log(
      `[DEBUG] Saved result for ${testCaseId} - ${projectName}: ${status} (${tracker.count}/${tracker.totalProjects})`,
    );

    // Write tracker data to file
    this.writeTrackerData(testCaseId, tracker);

    // Check if this is the last run
    if (!this.isLastRun(testCaseId, projectName)) {
      console.log(
        `[DEBUG] Not the last run yet (${tracker.count}/${tracker.totalProjects}), waiting for other browsers...`,
      );
      return;
    }

    console.log(`[DEBUG] All browsers completed, writing final result to Excel...`);
    await this.writeToExcelInternal(testInfo, testCaseId, status);
  }

  private async writeToExcelInternal(
    testInfo: TestInfo,
    testCaseId: string,
    status: string,
  ): Promise<void> {
    console.log(`[DEBUG] writeToExcelInternal - Test Case: ${testCaseId}, Status: ${status}`);
    console.log(`[DEBUG] Excel path: ${this.excelPath}`);
    console.log(`[DEBUG] Sheet name: ${this.config.sheetName}`);

    const releaseLock = await this.acquireLock();

    try {
      const workbook = new ExcelJSModule.Workbook();

      let retries = 5;
      let readSuccess = false;
      const readBaseDelay = 50;

      while (retries > 0 && !readSuccess) {
        try {
          await workbook.xlsx.readFile(this.excelPath);
          readSuccess = true;
        } catch (error) {
          retries--;
          if (retries > 0) {
            const randomDelay = readBaseDelay + Math.random() * 200;
            await new Promise((resolve) => setTimeout(resolve, randomDelay));
          } else {
            releaseLock();
            throw error;
          }
        }
      }

      let worksheet = workbook.getWorksheet(this.config.sheetName);
      if (!worksheet) {
        // Try with double space (actual Excel format)
        const altSheetName = this.config.sheetName.replace(' - ', ' -  ');
        worksheet = workbook.getWorksheet(altSheetName);
        if (!worksheet) {
          const sheetNames = workbook.worksheets.map((ws: ExcelJS.Worksheet) => ws.name);
          console.warn(
            `[DEBUG] Worksheet "${this.config.sheetName}" not found. Tried "${altSheetName}". Available sheets: ${JSON.stringify(sheetNames.slice(0, 10))}`,
          );
          return;
        }
      }

      const headerRowIndex = this.config.headerRowIndex;
      const headerRow = worksheet.getRow(headerRowIndex + 1);
      const headers: string[] = [];
      headerRow.eachCell({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
        headers.push(cell.value ? String(cell.value).trim() : '');
      });

      const rowIndex = this.findRowByTestCaseId(worksheet, headers, testCaseId);
      if (rowIndex === null) {
        console.warn(
          `[DEBUG] Could not find row for test case ID: ${testCaseId} in sheet: ${this.config.sheetName}`,
        );
        return;
      }

      const result1ColumnIndex = headers.findIndex((header) => {
        const headerStr = String(header).toLowerCase();
        return (
          (headerStr.includes('result') && headerStr.includes('1')) ||
          (headerStr.includes('結果') && headerStr.includes('Result 1'))
        );
      });
      if (result1ColumnIndex === -1) {
        return;
      }

      const row = worksheet.getRow(rowIndex);

      let hasRound1 = this.hasRound1Data(worksheet, row, headers, result1ColumnIndex);
      let roundNumber: 1 | 2 = hasRound1 ? 2 : 1;

      if (roundNumber === 1) {
        const result1Column = result1ColumnIndex + 1;
        const result1Cell = row.getCell(result1Column);
        if (result1Cell && result1Cell.value) {
          const existingResult = String(result1Cell.value).trim();
          if (existingResult === 'P' || existingResult === 'F') {
            hasRound1 = true;
            roundNumber = 2;
          }
        }
      }

      this.writeRoundData(row, headers, status, testCaseId, testInfo, roundNumber);

      const autoMethodColumnIndex = headers.findIndex((header) => {
        const headerStr = String(header).toLowerCase();
        return (
          (headerStr.includes('auto') && headerStr.includes('method')) ||
          headerStr.includes('スクリプト')
        );
      });

      if (autoMethodColumnIndex !== -1) {
        const autoMethodName = this.generateAutoMethodName(testInfo);
        const autoMethodColumn = autoMethodColumnIndex + 1;
        const autoMethodCell = row.getCell(autoMethodColumn);
        autoMethodCell.value = autoMethodName;
      }

      const folderNameColumnIndex = headers.findIndex((header) => {
        const headerStr = String(header).toLowerCase();
        return (
          (headerStr.includes('folder') && headerStr.includes('name')) ||
          headerStr.includes('フォルダー名')
        );
      });

      if (folderNameColumnIndex !== -1) {
        const folderName = this.extractFolderName(testInfo);
        if (folderName) {
          const folderNameColumn = folderNameColumnIndex + 1;
          const folderNameCell = row.getCell(folderNameColumn);
          folderNameCell.value = folderName;
        } else {
          console.warn(`Could not extract folder name for ${testCaseId}`);
        }
      }

      let writeRetries = 5;
      let writeSuccess = false;
      const writeBaseDelay = 50;

      while (writeRetries > 0 && !writeSuccess) {
        try {
          await workbook.xlsx.writeFile(this.excelPath);
          writeSuccess = true;

          if (roundNumber === 1) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            try {
              const verifyWorkbook = new ExcelJSModule.Workbook();
              await verifyWorkbook.xlsx.readFile(this.excelPath);
              const verifyWorksheet = verifyWorkbook.getWorksheet(this.config.sheetName);
              if (verifyWorksheet) {
                const verifyRow = verifyWorksheet.getRow(rowIndex);
                const verifyResult1Cell = verifyRow.getCell(result1ColumnIndex + 1);
                if (verifyResult1Cell && verifyResult1Cell.value) {
                  const verifyResult = String(verifyResult1Cell.value).trim();
                  if (verifyResult !== status) {
                    console.warn(
                      `Warning: Round 1 data mismatch for ${testCaseId}. Expected: ${status}, Found: ${verifyResult}`,
                    );
                  }
                }
              }
            } catch (verifyError) {
              console.warn(
                `Could not verify Round 1 data for ${testCaseId}: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`,
              );
            }
          }
        } catch (error) {
          writeRetries--;
          if (writeRetries > 0) {
            const randomDelay = writeBaseDelay + Math.random() * 200;
            await new Promise((resolve) => setTimeout(resolve, randomDelay));

            try {
              await workbook.xlsx.readFile(this.excelPath);
            } catch {
              await new Promise((resolve) => setTimeout(resolve, randomDelay));
            }
          } else {
            releaseLock();
            throw error;
          }
        }
      }

      // Delete tracker file after successfully writing to Excel
      this.deleteTrackerData(testCaseId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to write Excel result: ${errorMessage}`);
    } finally {
      releaseLock();
    }
  }
}

const getDefaultConfig = (): ExcelResultWriterConfig => {
  // Read sheet name from environment variable (set in global-setup.ts)
  const sheetName =
    process.env.EXCEL_SHEET_NAME ||
    (globalThis as typeof globalThis & { excelSheetName?: string }).excelSheetName ||
    'Super Admin -  List Admin';

  console.log(`[DEBUG] Excel config - Sheet name: "${sheetName}"`);

  return {
    excelFilePath: 'excel/AutomationTest_Template.xlsm',
    sheetName: sheetName,
    headerRowIndex: 7,
  };
};

export const excelResultWriter = new ExcelResultWriter(getDefaultConfig());

export const createExcelResultWriter = (config: Partial<ExcelResultWriterConfig>) => {
  return new ExcelResultWriter({ ...getDefaultConfig(), ...config });
};
