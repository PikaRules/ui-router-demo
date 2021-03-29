///<reference path="../custom-types-definitions.d.ts" />

import '../polyfills/polyfill';

// ANGULAR MATERIAL
import 'hammerjs';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

if ( process.env.BUILD_ENV === 'production' ) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => {
    console.log('some problem:');
    console.log(err);
});
