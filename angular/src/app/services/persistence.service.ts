import { Injectable, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ITheme } from '../models/theme';
import { ISettingRaw } from '../models/better';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private router = inject(Router);

  public init() {}

  private _gobackPage!: string;
  public get gobackPage(): string {
    return this._gobackPage;
  }
  public set gobackPage(gobackPage: string) {
    this._gobackPage = gobackPage;
  }

  public navigate(link: string) {
    this.router.navigate([link]);
  }
}
