import { Injectable, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private router = inject(Router);

  private _withClubName: boolean = false;
  public get withClubName(): boolean {
    return this._withClubName;
  }
  public set withClubName(withClubName: boolean) {
    this._withClubName = withClubName;
  }

  private _isAutoNavigation: boolean = false;
  public get isAutoNavigation(): boolean {
    return this._isAutoNavigation;
  }
  public set isAutoNavigation(isAutoNavigation: boolean) {
    this._isAutoNavigation = isAutoNavigation;
  }

  private _isDarkMode: boolean = false;
  public get isDarkMode(): boolean {
    return this._isDarkMode;
  }
  public set isDarkMode(isDarkMode: boolean) {
    this._isDarkMode = isDarkMode;
  }

  private _categoryId!: number;
  public get categoryId(): number {
    return this._categoryId;
  }
  public set categoryId(categoryId: number) {
    this._categoryId = categoryId;
  }

  private _sidenav!: MatSidenav;
  public get sidenav(): MatSidenav {
    return this._sidenav;
  }
  public set sidenav(sidenav: MatSidenav) {
    this._sidenav = sidenav;
  }

  private _aboutnav!: MatSidenav;
  public get aboutnav(): MatSidenav {
    return this._aboutnav;
  }
  public set aboutnav(aboutnav: MatSidenav) {
    this._aboutnav = aboutnav;
  }

  private _tutorialStep: number = 0;
  //public tutorialStepSubject: Subject<number> = new Subject<number>();
  public get tutorialStep(): number {
    return this._tutorialStep;
  }
  public set tutorialStep(tutorialStep: number) {
    this._tutorialStep = tutorialStep;
    //this.tutorialStepSubject.next(tutorialStep);
  }

  private _isToolbarVisible: boolean = false;
  public get isToolbarVisible(): boolean {
    return this._isToolbarVisible;
  }
  public set isToolbarVisible(isToolbarVisible: boolean) {
    this._isToolbarVisible = isToolbarVisible;
  }

  private _isPlayerReverse: boolean = false;
  public get isPlayerReverse(): boolean {
    return this._isPlayerReverse;
  }
  public set isPlayerReverse(isPlayerReverse: boolean) {
    this._isPlayerReverse = isPlayerReverse;
  }

  private _isCompactMode: boolean = false;
  public get isCompactMode(): boolean {
    return this._isCompactMode;
  }
  public set isCompactMode(isCompactMode: boolean) {
    this._isCompactMode = isCompactMode;
    if (isCompactMode) {
      this._freeSpace = 54;
    } else {
      this._freeSpace = 104;
    }
    this.freeSpaceSubject.next(this._freeSpace);
  }

  private _isToolbarLimitedMode: boolean = false;
  public get isToolbarLimitedMode(): boolean {
    return this._isToolbarLimitedMode;
  }
  public set isToolbarLimitedMode(isToolbarLimitedMode: boolean) {
    this._isToolbarLimitedMode = isToolbarLimitedMode;
  }

  private _freeSpace: number = 104;
  public freeSpaceSubject: Subject<number> = new Subject<number>();
  public get freeSpace(): number {
    return this._freeSpace;
  }
  public set freeSpace(freeSpace: number) {
    this.freeSpace = freeSpace;
    this.freeSpaceSubject.next(freeSpace);
  }

  private _isEvaluationDone: boolean = false;
  public get isEvaluationDone(): boolean {
    return this._isEvaluationDone;
  }
  public set isEvaluationDone(isEvaluationDone: boolean) {
    this._isEvaluationDone = isEvaluationDone;
  }

  private _gobackPage!: string;
  public get gobackPage(): string {
    return this._gobackPage;
  }
  public set gobackPage(gobackPage: string) {
    this._gobackPage = gobackPage;
  }

  public navigate(link: string) {
    this._isToolbarVisible = link === 'bet' || link === 'better-ranking';
    this._isToolbarLimitedMode = link !== 'bet';

    this.router.navigate([link]);
  }
}
