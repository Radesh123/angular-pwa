import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    registerServiceWorker();
  })
  .catch(err => console.error(err));

function registerServiceWorker() {
  if (navigator.serviceWorker) {
    if (navigator.serviceWorker.controller) {
      console.log('[PWA Builder] active service worker found, no need to register')
    } else {

      // Register the ServiceWorker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', {
          scope: './'
        }).then((reg) => {
          console.log('Service worker has been registered for scope:' + reg.scope);
        });
      }
    }
  }
}
