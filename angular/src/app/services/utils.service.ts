import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public static isNotNullNorUndefined(obj: unknown): boolean {
    return obj !== null && obj !== undefined;
  }
}
