import { Component, Renderer2, ViewChild, inject } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { ITheme } from 'src/app/models/theme';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetterService } from 'src/app/services/rest/better.service';
import { UtilsService } from 'src/app/services/utils.service';
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

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @ViewChild('settingsTrigger') settingsTrigger!: MatMenuTrigger;
  @ViewChild('themesTrigger') themesTrigger!: MatMenuTrigger;

  public get isClubName(): boolean {
    return this.persistenceService.isClubName;
  }

  public get themes(): ITheme[] {
    return this.persistenceService.themes;
  }

  public get colorThemes(): ITheme[] {
    return this.persistenceService.themes.slice(1);
  }

  public toggleClubName(better: IBetter | null, $event: any) {
    this.persistenceService.isClubName = !this.persistenceService.isClubName;

    if (better) {
      this.updateSetting(better);
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
    this.persistenceService.isFirstnameVisible =
      !this.persistenceService.isFirstnameVisible;

    if (better) {
      this.updateSetting(better);
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
    this.persistenceService.isPlayerRanking =
      !this.persistenceService.isPlayerRanking;

    if (better) {
      this.updateSetting(better);
    }

    $event.stopPropagation();
  }

  public get isAutoNavigation(): boolean {
    return this.persistenceService.isAutoNavigation;
  }

  public toggleAutoNavigation(better: IBetter | null) {
    this.persistenceService.isAutoNavigation =
      !this.persistenceService.isAutoNavigation;
    if (better) {
      this.updateSetting(better);
    }
  }

  public get isPlayerReverse(): boolean {
    return this.persistenceService.isPlayerReverse;
  }

  public togglePlayerReverse(better: IBetter | null) {
    this.persistenceService.isPlayerReverse =
      !this.persistenceService.isPlayerReverse;
    if (better) {
      this.updateSetting(better);
    }
  }

  public changeTheme($event: any, better: IBetter | null, id: number) {
    const theme = this.persistenceService.setTheme(id);
    this.utilsService.setMode(this.renderer, this.persistenceService.theme);

    if (better) {
      this.updateSetting(better);
    }

    $event.stopPropagation();
  }

  public isCurrentTheme(theme: ITheme): boolean {
    return theme.id === this.persistenceService.theme.id;
  }

  public getBorderClass(theme: ITheme): string {
    return theme.id === this.persistenceService.theme.id
      ? theme.border || 'transparent'
      : 'transparent';
  }

  private updateSetting(better: IBetter) {
    this.betterService.updateSetting(better).subscribe();
  }
}
