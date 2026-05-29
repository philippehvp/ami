import { DOCUMENT, inject, Injectable } from '@angular/core';

export enum THEME_MODE {
  LIGHT = 0,
  DARK = 1,
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private _currentMode: THEME_MODE = THEME_MODE.DARK;

  public switchThemeMode() {
    if (this._currentMode === THEME_MODE.LIGHT) {
      this.document.documentElement.classList.remove('light');
      this.document.documentElement.classList.add('dark');
      this._currentMode = THEME_MODE.DARK;
    } else {
      this.document.documentElement.classList.remove('dark');
      this.document.documentElement.classList.add('light');
      this._currentMode = THEME_MODE.LIGHT;
    }
  }
}
