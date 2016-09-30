import {Injectable} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class CacheContextService{
  
  constructor(private localStorageService: LocalStorageService) {
  }

  get(key: string) {
    return this.localStorageService.get(key);
  }

  set(key, value) {
    this.localStorageService.set(key, value);
  }
}

