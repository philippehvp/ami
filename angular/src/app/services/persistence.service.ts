import { Injectable, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IAvatar, IUniverse } from '../models/avatar';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private router = inject(Router);

  public init() {
    this._isClubName = false;
    this._isPlayerRanking = true;
    this._isFirstnameVisible = true;
    this._isAutoNavigation = false;
    this._isDarkMode = false;
    this._categoryId = -1;
    this._tutorialStep = 0;
    this._isToolbarVisible = false;
    this._isPlayerReverse = false;
    this._isCompactMode = false;
    this._isToolbarLimitedMode = false;
    this._isEvaluationDone = false;
    this._gobackPage = '';
    this._isReviewOfVisible = false;
    this._reviewOfBetterName = '';
  }

  private _isClubName: boolean = false;
  public get isClubName(): boolean {
    return this._isClubName;
  }
  public set isClubName(isClubName: boolean) {
    this._isClubName = isClubName;
  }

  private _isPlayerRanking: boolean = true;
  public get isPlayerRanking(): boolean {
    return this._isPlayerRanking;
  }
  public set isPlayerRanking(isPlayerRanking: boolean) {
    this._isPlayerRanking = isPlayerRanking;
  }

  private _isFirstnameVisible: boolean = true;
  public get isFirstnameVisible(): boolean {
    return this._isFirstnameVisible;
  }
  public set isFirstnameVisible(isFirstnameVisible: boolean) {
    this._isFirstnameVisible = isFirstnameVisible;
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

  private _sidenav!: MatSidenav | undefined;
  public get sidenav(): MatSidenav | undefined {
    return this._sidenav;
  }
  public set sidenav(sidenav: MatSidenav | undefined) {
    this._sidenav = sidenav;
  }

  private _aboutnav!: MatSidenav | undefined;
  public get aboutnav(): MatSidenav | undefined {
    return this._aboutnav;
  }
  public set aboutnav(aboutnav: MatSidenav | undefined) {
    this._aboutnav = aboutnav;
  }

  private _tutorialStep: number = 0;
  public get tutorialStep(): number {
    return this._tutorialStep;
  }
  public set tutorialStep(tutorialStep: number) {
    this._tutorialStep = tutorialStep;
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
  }

  private _isToolbarLimitedMode: boolean = false;
  public get isToolbarLimitedMode(): boolean {
    return this._isToolbarLimitedMode;
  }
  public set isToolbarLimitedMode(isToolbarLimitedMode: boolean) {
    this._isToolbarLimitedMode = isToolbarLimitedMode;
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

  private _isReviewOfVisible: boolean = false;
  public get isReviewOfVisible(): boolean {
    return this._isReviewOfVisible;
  }
  public set isReviewOfVisible(isReviewOfVisible: boolean) {
    this._isReviewOfVisible = isReviewOfVisible;
  }

  private _reviewOfBetterName: string = '';
  public get reviewOfBetterName(): string {
    return this._reviewOfBetterName;
  }
  public set reviewOfBetterName(reviewOfBetterName: string) {
    this._reviewOfBetterName = reviewOfBetterName;
  }

  private _universe: IUniverse | undefined = undefined;
  public get universe(): IUniverse | undefined {
    return this._universe;
  }
  public set universe(universe: IUniverse | undefined) {
    this._universe = universe;
  }

  private _avatar: IAvatar | undefined = undefined;
  public get avatar(): IAvatar | undefined {
    return this._avatar;
  }
  public set avatar(avatar: IAvatar | undefined) {
    this._avatar = avatar;
  }

  public navigate(link: string) {
    this._isToolbarVisible =
      link === 'bet' || link === 'better-ranking' || link === 'better-name';
    this._isToolbarLimitedMode = link !== 'bet';

    this.router.navigate([link]);
  }
}
