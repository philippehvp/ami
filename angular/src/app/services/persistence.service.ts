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

  public init() {
    this._isClubName = false;
    this._isAutoNavigation = false;
    this._isPlayerReverse = false;
    this._theme = this._themes[0];
    this._isPlayerRanking = true;
    this._isFirstnameVisible = true;

    this._isDurationCompactMode = false;

    this._categoryId = -1;
    this._tutorialStep = 0;
    this._isToolbarVisible = false;
    this._isCompactMode = false;
    this._isToolbarLimitedMode = false;
    this._isEvaluationDone = false;
    this._gobackPage = '';
    this._isReviewOfVisible = false;
    this._reviewOfBetterName = '';
  }

  public restoreSettings(settingRaw: ISettingRaw) {
    this.isClubName = settingRaw.clubName === 1;
    this.isAutoNavigation = settingRaw.autoNavigation === 1;
    this.isPlayerReverse = settingRaw.playerReverse === 1;
    this.setTheme(settingRaw.theme);
    this.isPlayerRanking = settingRaw.playerRanking === 1;
    this.isFirstnameVisible = settingRaw.firstnameVisible === 1;
  }

  public getSettings(): ISettingRaw {
    return {
      clubName: this._isClubName ? 1 : 0,
      autoNavigation: this._isAutoNavigation ? 1 : 0,
      playerReverse: this._isPlayerReverse ? 1 : 0,
      theme: this._theme.id,
      playerRanking: this._isPlayerRanking ? 1 : 0,
      firstnameVisible: this._isFirstnameVisible ? 1 : 0,
    };
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

  private _currentClass: string = '';
  public get currentClass(): string {
    return this._currentClass;
  }
  public set currentClass(currentClass: string) {
    this._currentClass = currentClass;
  }

  private _themes: ITheme[] = [
    {
      id: 1,
      name: 'Tournoi ISB 2023',
      mode: 'isb-theme',
      isLight: true,
      color:
        'linear-gradient(150deg, #fcc916, #f28e16, #c5e6f7, #6caee0, #b0d6b1, #8abb8c)',
      border: 'black',
      isAnimated: false,
    },
    {
      id: 2,
      name: 'Disques chromatiques',
      mode: 'circle-theme',
      isLight: true,
      color: '#d0d0d0',
      border: 'black',
      isAnimated: true,
    },

    {
      id: 3,
      name: 'Ondulations',
      mode: 'wave-theme',
      isLight: true,
      color:
        'linear-gradient(to bottom, #9831a1 20%, #f4e0bb 10%, #f4e0bb 80%, #ac3631 80%)',
      border: 'black',
      isAnimated: true,
    },
    {
      id: 4,
      name: 'Bulles aquatiques',
      mode: 'bubble-theme',
      isLight: true,
      color: 'linear-gradient(-135deg, #272896, #7295e2)',
      border: 'black',
      isAnimated: true,
    },
    {
      id: 5,
      name: 'Ciel étoilé',
      mode: 'sky-theme',
      isLight: false,
      color: 'linear-gradient(-135deg, #222, #24323b, #4d5256)',
      border: 'white',
      isAnimated: true,
    },
  ];

  public get themes(): ITheme[] {
    return this._themes;
  }

  private _theme: ITheme = this._themes[0];
  public get theme(): ITheme {
    return this._theme;
  }

  public setTheme(id: number): ITheme {
    const theme: ITheme | undefined = this._themes.find((t) => {
      return t.id === id;
    });

    if (theme) {
      this._theme = theme;
    }

    return this._theme;
  }

  private _isThemeAnimated: boolean = true;
  public get isThemeAnimated(): boolean {
    return this._isThemeAnimated;
  }
  public set isThemeAnimated(isThemeAnimated: boolean) {
    this._isThemeAnimated = isThemeAnimated;
  }

  private _isThemeAnimationShown: boolean = true;
  public get isThemeAnimationShown(): boolean {
    return this._isThemeAnimationShown;
  }
  public set isThemeAnimationShown(isThemeAnimationShown: boolean) {
    this._isThemeAnimationShown = isThemeAnimationShown;
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

  private _isDurationCompactMode: boolean = false;
  public get isDurationCompactMode(): boolean {
    return this._isDurationCompactMode;
  }
  public set isDurationCompactMode(isDurationCompactMode: boolean) {
    this._isDurationCompactMode = isDurationCompactMode;
  }

  private _isToolbarLimitedMode: boolean = false;
  public get isToolbarLimitedMode(): boolean {
    return this._isToolbarLimitedMode;
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

  public navigate(link: string) {
    this._isToolbarVisible =
      link === 'bet' || link === 'better-ranking' || link === 'better-name';
    this._isToolbarLimitedMode = link !== 'bet';

    this.router.navigate([link]);
  }

  private _originalCredits: string[] = [
    'Philippe HVP',
    'Clémence Z',
    'Alexandre P',
    'Maxime H',
    'Alexandre D',
    'Perrine A',
    'Lucie F',
    'Quentin LB',
    'Anaïs M',
  ];

  private _credits: string[] = [];

  public get credits(): string[] {
    return this._credits;
  }

  public shuffleCredits() {
    // On mélange les ligne du tableau pour afficher les remerciements dans un ordre aléatoire à chaque ouverture
    // du panneau A propos de
    // Ceci dit, on mettra toujours Stéphane N en début de liste

    // A chaque mélange, on repart de la version sans Stéphane N
    this._credits = [...this._originalCredits];

    // On mélange la liste
    for (let i: number = this._credits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this._credits[i];
      this._credits[i] = this._credits[j];
      this._credits[j] = temp;
    }

    // On ajoute Stéphane N au début
    this._credits = ['Stéphane N', ...this._credits];
  }
}
