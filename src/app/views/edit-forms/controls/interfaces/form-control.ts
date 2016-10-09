import {IJBFormValidator} from './validator';
import {IJNFormParser} from './parser';

export interface IJNFormControl{
  "formTemplate?": String,
  "label": String,
  "maxLength?": number, // max length of input
  "minLength?": number, // min length of input
  "hidden?": String, // if hidden is true, hide the form control
  "disabled?": String, // if data is editable or not, default true,
  "placeholder?": String,
  "model?": String,
  "$validate?": IJNFormControl[],
  "$parser?": IJNFormParser,
  "$formatter?": ()=>{} | string // formate view data to modal data
}