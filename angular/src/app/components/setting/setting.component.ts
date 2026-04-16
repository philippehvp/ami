import { Component, Renderer2, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Store } from '@ngxs/store';
import { Observable, map, tap } from 'rxjs';
import { IBetter, ISetting } from '../../models/better';
import { ITheme } from '../../models/theme';
import { IEmpty, IOffline } from '../../models/utils';
import { PersistenceService } from '../../services/persistence.service';
import { BetterService } from '../../services/rest/better.service';
import { ThemeService } from '../../services/theme.service';
import { BetActions } from '../../store/action/bet.action';
import { ConnectionActions } from '../../store/action/connection.action';
import { BetState } from '../../store/state/bet.state';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  imports: [AsyncPipe, MatMenuTrigger, MatMenu, MatSlideToggleModule],
})
export class SettingComponent {
  public better$!: Observable<IBetter>;

  @ViewChild('settingsMenuTrigger') settingsMenuTrigger!: MatMenuTrigger;
  @ViewChild('themesMenuTrigger') themesMenuTrigger!: MatMenuTrigger;

  constructor(
    private readonly persistenceService: PersistenceService,
    private readonly betterService: BetterService,
    private readonly renderer: Renderer2,
    private readonly themeService: ThemeService,
    private readonly store: Store,
  ) {
    this.better$ = this.store.select(BetState.better);
  }

  public get isClubName(): boolean {
    return this.persistenceService.isClubName;
  }

  public get theme(): ITheme {
    return this.persistenceService.theme;
  }

  public get themes(): ITheme[] {
    return this.persistenceService.themes;
  }

  public toggleClubName(better: IBetter | null, $event: any) {
    if (better) {
      const settings: ISetting = this.getCurrentSettings();
      settings.isClubName = !this.persistenceService.isClubName;
      this.updateSetting(better, settings)
        .pipe(
          tap((setting) => {
            if (setting) {
              this.persistenceService.isClubName =
                !this.persistenceService.isClubName;

              window.localStorage.setItem(
                'settings',
                JSON.stringify(this.persistenceService.getSettings()),
              );
            }
          }),
        )
        .subscribe();
    }

    $event.stopPropagation();
  }

  public get isFirstnameVisible(): boolean {
    return this.persistenceService.isFirstnameVisible;
  }

  public set isFirstnameVisible(isFirstnameVisible: boolean) {
    this.persistenceService.isFirstnameVisible = isFirstnameVisible;
  }

  public toggleFirstnameVisible(better: IBetter | null, $event: any) {
    if (better) {
      const settings: ISetting = this.getCurrentSettings();
      settings.isFirstnameVisible = !this.persistenceService.isFirstnameVisible;
      this.updateSetting(better, settings)
        .pipe(
          tap((setting) => {
            if (setting) {
              this.persistenceService.isFirstnameVisible =
                !this.persistenceService.isFirstnameVisible;

              window.localStorage.setItem(
                'settings',
                JSON.stringify(this.persistenceService.getSettings()),
              );
            }
          }),
        )
        .subscribe();
    }

    $event.stopPropagation();
  }

  public get isPlayerRanking(): boolean {
    return this.persistenceService.isPlayerRanking;
  }

  public set isPlayerRanking(isPlayerRanking: boolean) {
    this.persistenceService.isPlayerRanking = isPlayerRanking;
  }

  public togglePlayerRanking(better: IBetter | null, $event: any) {
    if (better) {
      const settings: ISetting = this.getCurrentSettings();
      settings.isPlayerRanking = !this.persistenceService.isPlayerRanking;
      this.updateSetting(better, settings)
        .pipe(
          tap((setting) => {
            if (setting) {
              this.persistenceService.isPlayerRanking =
                !this.persistenceService.isPlayerRanking;

              window.localStorage.setItem(
                'settings',
                JSON.stringify(this.persistenceService.getSettings()),
              );
            }
          }),
        )
        .subscribe();
    }

    $event.stopPropagation();
  }

  public get isAutoNavigation(): boolean | undefined {
    return this.persistenceService.isAutoNavigation;
  }

  public toggleAutoNavigation(better: IBetter | null) {
    if (better) {
      const settings: ISetting = this.getCurrentSettings();
      settings.isAutoNavigation = !this.persistenceService.isAutoNavigation;
      this.updateSetting(better, settings)
        .pipe(
          tap((setting) => {
            if (setting) {
              this.persistenceService.isAutoNavigation =
                !this.persistenceService.isAutoNavigation;

              window.localStorage.setItem(
                'settings',
                JSON.stringify(this.persistenceService.getSettings()),
              );

              if (this.persistenceService.isAutoNavigation) {
                this.store.dispatch([
                  new BetActions.GotoNextCategoryIfCurrentIsComplete(),
                ]);
              }
            }
          }),
        )
        .subscribe();
    }
  }

  public get autoNavigationLabel(): string {
    return this.persistenceService.isAutoNavigation
      ? 'Nav. auto.'
      : 'Nav. man.';
  }

  public get autoNavigationIcon(): string {
    return this.persistenceService.isAutoNavigation
      ? 'gps_fixed'
      : 'gps_not_fixed';
  }

  public get isPlayerReverse(): boolean {
    return this.persistenceService.isPlayerReverse;
  }

  public togglePlayerReverse(better: IBetter | null) {
    if (better) {
      const settings: ISetting = this.getCurrentSettings();
      settings.isPlayerReverse = !this.persistenceService.isPlayerReverse;
      this.updateSetting(better, settings)
        .pipe(
          tap((setting) => {
            if (setting) {
              this.persistenceService.isPlayerReverse =
                !this.persistenceService.isPlayerReverse;

              window.localStorage.setItem(
                'settings',
                JSON.stringify(this.persistenceService.getSettings()),
              );
            }
          }),
        )
        .subscribe();
    }
  }

  public get playerReverseLabel(): string {
    return this.persistenceService.isPlayerReverse ? 'Gauche' : 'Droite';
  }

  public get playerReverseIcon(): string {
    return this.persistenceService.isPlayerReverse ? 'list' : 'toc';
  }

  public get isThemeAnimated(): boolean {
    return this.persistenceService.isThemeAnimated;
  }

  public get isThemeAnimationShown(): boolean {
    return this.persistenceService.isThemeAnimationShown;
  }

  public toggleAnimateTheme(theme: ITheme, $event: any) {
    if (theme.isAnimated) {
      this.persistenceService.isThemeAnimated =
        !this.persistenceService.isThemeAnimated;
    }
    $event.stopPropagation();
  }

  public toggleShowThemeAnimation(theme: ITheme, $event: any) {
    if (theme.isAnimated) {
      this.persistenceService.isThemeAnimationShown =
        !this.persistenceService.isThemeAnimationShown;
    }
    $event.stopPropagation();
  }

  public changeTheme($event: any, better: IBetter | null, id: number) {
    if (better && id !== this.persistenceService.theme.id) {
      const settings: ISetting = this.getCurrentSettings();
      settings.theme = id;
      this.updateSetting(better, settings)
        .pipe(
          tap((setting) => {
            if (setting) {
              const theme = this.persistenceService.setTheme(id);
              this.themeService.setTheme(
                this.renderer,
                this.persistenceService.theme,
              );

              window.localStorage.setItem(
                'settings',
                JSON.stringify(this.persistenceService.getSettings()),
              );
            }
          }),
        )
        .subscribe();
    }

    $event.stopPropagation();
  }

  public isCurrentTheme(theme: ITheme): boolean {
    return theme.id === this.persistenceService.theme.id;
  }

  public isThemeAnimable(theme: ITheme): boolean {
    return theme.isAnimated;
  }

  public getBorderColor(theme: ITheme): string {
    return theme.id === this.persistenceService.theme.id
      ? theme.border || 'transparent'
      : 'transparent';
  }

  private getCurrentSettings(): ISetting {
    return <ISetting>{
      isAutoNavigation: this.persistenceService.isAutoNavigation,
      isClubName: this.persistenceService.isClubName,
      isFirstnameVisible: this.persistenceService.isFirstnameVisible,
      isPlayerRanking: this.persistenceService.isPlayerRanking,
      isPlayerReverse: this.persistenceService.isPlayerReverse,
      theme: this.persistenceService.theme.id,
    };
  }

  private updateSetting(
    better: IBetter,
    settings: ISetting,
  ): Observable<IEmpty | IOffline | ISetting | null> {
    return this.betterService.updateSetting(better, settings).pipe(
      map((settings) => {
        if (settings && 'isOffline' in settings) {
          this.store.dispatch([new ConnectionActions.IsOffline()]);
          return null;
        } else {
          return settings;
        }
      }),
    );
  }
}
