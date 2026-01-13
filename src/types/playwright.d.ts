import type { PlaywrightTestArgs } from '@playwright/test';
import type { HealthApi } from '@api/health-api';
import type { ExternalApi } from '@api/external-api';
import type { LoginPage } from '@pages/login-page';

declare module '@playwright/test' {
  interface TestArgs extends PlaywrightTestArgs {
    healthApi: HealthApi;
    externalApi: ExternalApi;
    loginPage: LoginPage;
  }
}
