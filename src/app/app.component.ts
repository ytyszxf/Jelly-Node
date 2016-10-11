import { Component } from '@angular/core';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {cn, en} from '../assets/i18n';
import {ApplicationContextService} from './shared/services/applicationContext.service';

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

        setTimeout(() => {
            //this.logParamTypes(this.test, 'appContext');
        }, 3000);
        getParams(this.test);
    }

    @logParamTypes
    private test(appContext: ApplicationContextService) {
        
    }

}

// declare property decorator
function logParamTypes(target: any, key: string) {
    setTimeout(() => {
        var types = Reflect.getMetadata("design:paramtypes", target, key);
        var s = types.map(a => a.name).join();
        console.log(`${key} param types: ${s}`);
    }, 3000);
}  

function getParams(func: Function) {
    setTimeout(function () {
        console.log(TranslateService['token']);
        // console.log(Reflect.getMetadata('parameters', func, 'appContext'));
    }, 5000);
}