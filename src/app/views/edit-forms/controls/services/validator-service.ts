import { Injectable } from '@angular/core';
import {FormBuilder, Validators, FormControl, FormGroup} from '@angular/forms';
import {IJBFormValidator} from '../interfaces/validator';
import {JNFormValidator} from '../entities/validator';

@Injectable()
export class ValidatorService{
  constructor() {
    
  }

  public generatorValidators(validators: IJBFormValidator[]): JNFormValidator[] {
    // ::TODO  
    return [];
  }
}