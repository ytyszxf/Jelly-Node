import {Component, Input, Output, ElementRef, Renderer, NgZone, SimpleChange} from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';

const noop = () => {
};

export abstract class NodeFormControl{
  @Input()
  protected disabled: boolean;
  @Input()
  protected fieldName: String;
  @Input()
  protected hidden: String;
  @Input()
  protected ApplicationContext;
  @Input()
  protected ConfigContext;
  @Input()
  protected label: String;

  private onChangeCallback: (_: any) => void = noop;
  private onTouchedCallback: () => void = noop;
  private _value;

  constructor(
    private el: ElementRef,
    public renderer: Renderer,
    private _zone: NgZone) {
  }

  //get accessor
  get value(): any {
    return this._value;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this._value) {
      this._zone.run(()=>{
        this._value = v;
        this.onChangeCallback(v);
      });
    }
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.value) {
      this.value = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
      this.onTouchedCallback = fn;
  }
}