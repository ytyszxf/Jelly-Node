import {Component} from '@angular/core';
import {ApplicationContextService} from '../../services'

@Component({
  selector: "jn-editform",
  template: require('./edit-form.html'),
  styles: [require('./edit-form.scss')]
})
export class JNEditFormComponent{

  constructor(appContext: ApplicationContextService) {
    console.log(appContext.get('a'));
  }

}