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

  public toggleWithClubName(better: IBetter | null) {
    if (better) {
      better.setting.withClubName = !better.setting.withClubName;
      this.persistenceService.withClubName = better.setting.withClubName;
    }
  }

  public toggleAutoNavigation(better: IBetter | null) {
    if (better) {
      better.setting.isAutoNavigation = !better.setting.isAutoNavigation;
    }
  }

  public togglePlayerReverse(better: IBetter | null) {
    if (better) {
      better.setting.isPlayerReverse = !better.setting.isPlayerReverse;
      this.persistenceService.isPlayerReverse = better.setting.isPlayerReverse;
    }
  }

  public toggleDarkMode(better: IBetter | null) {
    if (better) {
      better.setting.isDarkMode = !better.setting.isDarkMode;
      this.utilsService.setMode(this.renderer, better.setting.isDarkMode);
    }
  }

  public close(better: IBetter | null) {
    if (better) {
      // Sauvegarde des paramètres pour le pronostiqueur
      this.betterService.updateSetting(better).subscribe();
    }
    this.matDialogRef.close();
  }
}
