import { Component, Renderer2, inject } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IBetter } from 'src/app/models/better';
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

  public get clubName(): boolean {
    return this.persistenceService.isClubName;
  }

  public set clubName(isClubName: boolean) {
    this.persistenceService.isClubName = isClubName;
  }

  public toggleClubName(better: IBetter | null, $event: any) {
    this.persistenceService.isClubName = !this.persistenceService.isClubName;

    if (better) {
      this.updateSetting(better);
    }

    $event.stopPropagation();
  }

  public get isPlayerNameOnly(): boolean {
    return this.persistenceService.isPlayerNameOnly;
  }

  public set isPlayerNameOnly(isPlayerNameOnly: boolean) {
    this.persistenceService.isPlayerNameOnly = isPlayerNameOnly;
  }

  public togglePlayerNameOnly(better: IBetter | null, $event: any) {
    this.persistenceService.isPlayerNameOnly =
      !this.persistenceService.isPlayerNameOnly;

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

  public toggleAutoNavigation(better: IBetter | null) {
    this.persistenceService.isAutoNavigation =
      !this.persistenceService.isAutoNavigation;
    if (better) {
      this.updateSetting(better);
    }
  }

  public togglePlayerReverse(better: IBetter | null) {
    this.persistenceService.isPlayerReverse =
      !this.persistenceService.isPlayerReverse;
    if (better) {
      this.updateSetting(better);
    }
  }

  public toggleDarkMode(better: IBetter | null) {
    this.persistenceService.isDarkMode = !this.persistenceService.isDarkMode;
    this.utilsService.setMode(
      this.renderer,
      this.persistenceService.isDarkMode
    );
    if (better) {
      this.updateSetting(better);
    }
  }

  public get isClubName(): boolean {
    return this.persistenceService.isClubName;
  }

  public get isAutoNavigation(): boolean {
    return this.persistenceService.isAutoNavigation;
  }

  public get isPlayerReverse(): boolean {
    return this.persistenceService.isPlayerReverse;
  }

  public get isDarkMode(): boolean {
    return this.persistenceService.isDarkMode;
  }

  private updateSetting(better: IBetter) {
    this.betterService.updateSetting(better).subscribe();
  }
}
