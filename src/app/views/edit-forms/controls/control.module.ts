import { NgModule, Provider }      from '@angular/core';

import { ValidatorService }  from './services/validator-service';



@NgModule({
  providers: [ValidatorService]
})
export class JNControlModule { }