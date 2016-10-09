import {IJNFormControl} from './form-control';
import {IJBFormButton} from './button';

export interface IViewSchema {
  "title": String,
  "buttons": IJBFormButton[],
  "viewTemplate?": String,
  "formControls?": IJNFormControl[]
}