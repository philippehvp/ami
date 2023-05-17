import { Platform } from '@angular/cdk/platform';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private platform = inject(Platform);

  private _isMobile: boolean | null = null;

  public get isMobile(): boolean {
    if (this._isMobile !== null) {
      return this._isMobile;
    } else {
      this._isMobile =
        this.platform.ANDROID || this.platform.IOS || window.innerWidth <= 768;
      return this._isMobile;
    }
  }
}
