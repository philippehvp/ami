import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private _withClubName: boolean = false;
  private _categoryId!: number;

  private _sidenav!: MatSidenav;

  private _currentPage!: string;

  private _tutorialStep!: number;

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

  public get currentPage(): string {
    return this._currentPage;
  }

  public set currentPage(currentPage: string) {
    this._currentPage = currentPage;
  }

  public get tutorialStep(): number {
    return this._tutorialStep;
  }

  public set tutorialStep(tutorialStep: number) {
    this._tutorialStep = tutorialStep;
  }
}
