import { Injectable, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private router = inject(Router);

  private _withClubName: boolean = false;
  private _categoryId!: number;

  private _sidenav!: MatSidenav;
  private _aboutnav!: MatSidenav;

  private _isToolbarVisible: boolean = false;

  private _tutorialStep!: number;

  private _isPlayerReverse: boolean = false;

  public get withClubName(): boolean {
    return this._withClubName;
  }

  public set withClubName(withClubName: boolean) {
    this._withClubName = withClubName;
  }

  public get categoryId(): number {
    return this._categoryId;
  }

  public set categoryId(categoryId: number) {
    this._categoryId = categoryId;
  }

  public get sidenav(): MatSidenav {
    return this._sidenav;
  }

  public set sidenav(sidenav: MatSidenav) {
    this._sidenav = sidenav;
  }

  public get aboutnav(): MatSidenav {
    return this._aboutnav;
  }

  public set aboutnav(aboutnav: MatSidenav) {
    this._aboutnav = aboutnav;
  }

  public get tutorialStep(): number {
    return this._tutorialStep;
  }

  public set tutorialStep(tutorialStep: number) {
    this._tutorialStep = tutorialStep;
  }

  public get isToolbarVisible(): boolean {
    return this._isToolbarVisible;
  }

  public set isToolbarVisible(isToolbarVisible: boolean) {
    this._isToolbarVisible = isToolbarVisible;
  }

  public navigate(link: string) {
    if (link === 'bet') {
      this._isToolbarVisible = true;
    } else {
      this._isToolbarVisible = false;
    }
    this.router.navigate([link]);
  }

  public get isPlayerReverse(): boolean {
    return this._isPlayerReverse;
  }

  public set isPlayerReverse(isPlayerReverse: boolean) {
    this._isPlayerReverse = isPlayerReverse;
  }
}
