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
  public tutorialStepSubject: Subject<number> = new Subject<number>();
  public get tutorialStep(): number {
    return this._tutorialStep;
  }
  public set tutorialStep(tutorialStep: number) {
    this._tutorialStep = tutorialStep;
    this.tutorialStepSubject.next(tutorialStep);
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

  private _isEvaluationDone: boolean = false;
  public get isEvaluationDone(): boolean {
    return this._isEvaluationDone;
  }
  public set isEvaluationDone(isEvaluationDone: boolean) {
    this._isEvaluationDone = isEvaluationDone;
  }

  public navigate(link: string) {
    if (link === 'bet') {
      this._isToolbarVisible = true;
    } else {
      this._isToolbarVisible = false;
    }
    this.router.navigate([link]);
  }
}
