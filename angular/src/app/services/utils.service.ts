import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Injectable, Renderer2, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private platform = inject(Platform);
  private document = inject(DOCUMENT);

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

  public setMode(renderer: Renderer2, isDarkMode: boolean) {
    renderer.setAttribute(
      this.document.body,
      'class',
      isDarkMode ? 'dark-mode' : 'light-mode'
    );
  }
}
