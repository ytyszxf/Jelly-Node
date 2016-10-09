import {Injectable, Inject} from '@angular/core';
import {Http} from '@angular/http';
import {JNConfig} from '../../jn-config';

@Injectable()
export class ConfigContextService{
  private _storage: Object;

  constructor(private http: Http) {
    this._storage = JNConfig || {};
  }

  get(key: string) {
    return this._storage[key];
  }

  set(key: string, value) {
    return this._storage[key] = value;
  }
}