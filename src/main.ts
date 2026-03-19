import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app.component';
import { validateBrowserSupport } from './app/utils/api-checks';
import { removeLoadingScreen, showErrorScreen } from './loading-screen';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startApp() {
  const startTime = Date.now();

  const errors = validateBrowserSupport();

  if (errors.length > 0) {
    showErrorScreen(errors);
    return;
  }

  try {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, 1000 - elapsed);

    await delay(remaining);
    await bootstrapApplication(App, appConfig);

    removeLoadingScreen();
  } catch (err) {
    console.error(err);
  }
}

startApp();
