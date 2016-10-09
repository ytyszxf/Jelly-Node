import {NgModule} from '@angular/core';
import {JNControlModule} from './controls/control.module';
import {JNEditFormComponent} from './edit-form.component';
import {TranslateModule} from 'ng2-translate/ng2-translate';

@NgModule({
  declarations: [JNEditFormComponent],
  imports: [JNControlModule, TranslateModule.forRoot()],
  exports: [JNEditFormComponent],
  providers: []
})
export class EditFormModule { }