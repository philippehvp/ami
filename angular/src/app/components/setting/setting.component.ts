import { Component, Renderer2, ViewChild, inject } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Select, Store } from '@ngxs/store';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { IBetter, ISetting } from 'src/app/models/better';
import { ITheme } from 'src/app/models/theme';
import { IEmpty, IOffline } from 'src/app/models/utils';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetterService } from 'src/app/services/rest/better.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ConnectionActions } from 'src/app/store/action/connection.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  private persistenceService = inject(PersistenceService);
  private betterService = inject(BetterService);
  private renderer = inject(Renderer2);
  private utilsService = inject(UtilsService);
  private store = inject(Store);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @ViewChild('settingsTrigger') settingsTrigger!: MatMenuTrigger;
  @ViewChild('themesTrigger') themesTrigger!: MatMenuTrigger;

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
      this.updateSetting(better)
        .pipe(
          tap((setting) => {
            if (setting) {
              this.persistenceService.isClubName =
                !this.persistenceService.isClubName;
            }
          })
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
      this.updateSetting(better)
        .pipe(
          tap((setting) => {
            if (setting) {
              this.persistenceService.isFirstnameVisible =
                !this.persistenceService.isFirstnameVisible;
            }
          })
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
      this.updateSetting(better)
        .pipe(
          tap((setting) => {
            if (setting) {
              this.persistenceService.isPlayerRanking =
                !this.persistenceService.isPlayerRanking;
            }
          })
        )
        .subscribe();
    }

    $event.stopPropagation();
  }

  public get isAutoNavigation(): boolean {
    return this.persistenceService.isAutoNavigation;
  }

  public toggleAutoNavigation(better: IBetter | null) {
    if (better) {
      this.updateSetting(better)
        .pipe(
          tap((setting) => {
            if (setting) {
              this.persistenceService.isAutoNavigation =
                !this.persistenceService.isAutoNavigation;
            }
          })
        )
        .subscribe();
    }
  }

  public get isPlayerReverse(): boolean {
    return this.persistenceService.isPlayerReverse;
  }

  public togglePlayerReverse(better: IBetter | null) {
    if (better) {
      this.updateSetting(better)
        .pipe(
          tap((setting) => {
            if (setting) {
              this.persistenceService.isPlayerReverse =
                !this.persistenceService.isPlayerReverse;
            }
          })
        )
        .subscribe();
    }
  }

  public changeTheme($event: any, better: IBetter | null, id: number) {
    if (better) {
      this.updateSetting(better)
        .pipe(
          tap((setting) => {
            if (setting) {
              const theme = this.persistenceService.setTheme(id);
              this.utilsService.setMode(
                this.renderer,
                this.persistenceService.theme
              );
            }
          })
        )
        .subscribe();
    }

    $event.stopPropagation();
  }

  public isCurrentTheme(theme: ITheme): boolean {
    return theme.id === this.persistenceService.theme.id;
  }

  public getBorderColor(theme: ITheme): string {
    return theme.id === this.persistenceService.theme.id
      ? theme.border || 'transparent'
      : 'transparent';
  }

  private updateSetting(
    better: IBetter
  ): Observable<IEmpty | IOffline | ISetting | null> {
    return this.betterService.updateSetting(better).pipe(
      map((settings) => {
        if (settings && 'isOffline' in settings) {
          this.store.dispatch([new ConnectionActions.IsOffline()]);
          return null;
        } else {
          return settings;
        }
      })
    );
  }
}
