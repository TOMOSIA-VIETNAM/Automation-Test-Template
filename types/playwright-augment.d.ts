import 'playwright/test';
import '@playwright/test';

declare module 'playwright/test' {
  interface TestDetails {
    severity?: string;
    description?: string;
    tag?: string[];
  }
}

declare module '@playwright/test' {
  interface TestDetails {
    severity?: string;
    description?: string;
    tag?: string[];
  }
}
