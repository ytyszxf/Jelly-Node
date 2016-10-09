import {Component, Input, Output} from '@angular/core';
import {NodeFormControl} from '../../control.component';

@Component({
  'selector': 'jn-textarea',
  styles: [require('./textarea.scss')],
  template: require('./textarea.html')
})
export class FormTextareaControl extends NodeFormControl{
  
}