import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { GraphicComponent } from './views'
/*
* Platform and Environment
* our providers/directives/pipes
*/

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent, GraphicComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }