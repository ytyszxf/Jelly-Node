import { NgModule, Provider }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { PROVIDERS } from './shared/services';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import { HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import { AppComponent }  from './app.component';
import { JNViewModule } from './views'
import { EditFormModule } from './views/edit-forms/edit-form.module';

 
// Create config options (see ILocalStorageServiceConfigOptions) for deets:
let localStorageServiceConfig = {
  prefix: 'jn-app',
  storageType: 'sessionStorage'
};
// Provide the config to the service:
const LOCAL_STORAGE_CONFIG_PROVIDER: Provider = {
  provide: LOCAL_STORAGE_SERVICE_CONFIG,
  useValue: localStorageServiceConfig
};
/*
* Platform and Environment
* our providers/directives/pipes
*/

@NgModule({
  imports: [ BrowserModule, HttpModule, TranslateModule.forRoot(), EditFormModule, MaterialModule.forRoot(), JNViewModule ],
  declarations: [ AppComponent],
  bootstrap: [AppComponent],
  providers: [LocalStorageService, LOCAL_STORAGE_CONFIG_PROVIDER, {
    provide: TranslateLoader,
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
    deps: [Http]
  }, ...PROVIDERS]
})
export class AppModule { }