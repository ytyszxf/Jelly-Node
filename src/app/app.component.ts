import { Component } from '@angular/core';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {cn, en} from '../assets/i18n';
import {ApplicationContextService} from './services/applicationContext.service';

@Component({
    selector: 'app',
    template: '<jn-editform></jn-editform>'
})
export class AppComponent {

    constructor(translate: TranslateService, appContext: ApplicationContextService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('cn');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('cn');

        setTimeout(() => {
            translate.set('APP_NAME', 'NODE_RED', 'cn');
        }, 1000);  

        translate.setTranslation('cn', cn);
        translate.setTranslation('en', en);
        appContext.set('a', '123');
    }

}