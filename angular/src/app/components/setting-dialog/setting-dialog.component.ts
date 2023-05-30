import { Component, Renderer2, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetterService } from 'src/app/services/rest/better.service';
import { UtilsService } from 'src/app/services/utils.service';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'setting-dialog',
  templateUrl: './setting-dialog.component.html',
  styleUrls: ['./setting-dialog.component.scss'],
})
export class SettingDialogComponent {
  private matDialogRef = inject(MatDialogRef<SettingDialogComponent>);
  private utilsService = inject(UtilsService);
  private persistenceService = inject(PersistenceService);
  private renderer = inject(Renderer2);
  private betterService = inject(BetterService);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  public get withClubName(): boolean {
    return this.persistenceService.withClubName;
  }

  public toggleWithClubName() {
    this.persistenceService.withClubName =
      !this.persistenceService.withClubName;
  }

  public get isAutoNavigation(): boolean {
    return this.persistenceService.isAutoNavigation;
  }

  public toggleAutoNavigation() {
    this.persistenceService.isAutoNavigation =
      !this.persistenceService.isAutoNavigation;
  }

  public get isPlayerReverse(): boolean {
    return this.persistenceService.isPlayerReverse;
  }

  public togglePlayerReverse() {
    this.persistenceService.isPlayerReverse =
      !this.persistenceService.isPlayerReverse;
  }

  public get isDarkMode(): boolean {
    return this.persistenceService.isDarkMode;
  }

  public toggleDarkMode() {
    this.persistenceService.isDarkMode = !this.persistenceService.isDarkMode;
    this.utilsService.setMode(
      this.renderer,
      this.persistenceService.isDarkMode
    );
  }

  public close(better: IBetter | null) {
    if (better) {
      // Sauvegarde des paramètres pour le pronostiqueur
      this.betterService.updateSetting(better).subscribe();
    }
    this.matDialogRef.close();
  }
}
