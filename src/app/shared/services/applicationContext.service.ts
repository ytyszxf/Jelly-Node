import {Injectable} from '@angular/core';

@Injectable()
export class ApplicationContextService{
  private _storage: Object = {};

  get(key: string) {
    return this._storage[key];
  }

  set(key: string, value) {
    return this._storage[key] = value;
  }
}