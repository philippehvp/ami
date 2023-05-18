import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  private persistenceService = inject(PersistenceService);
  private bottomSheet = inject(MatBottomSheet);

  public toggleWithClubName() {
    this.persistenceService.withClubName =
      !this.persistenceService.withClubName;
  }

  public get withClubName(): boolean {
    return this.persistenceService.withClubName;
  }

  public set withClubName(withClubName: boolean) {
    this.persistenceService.withClubName = withClubName;
  }

  public get isAutoNavigation(): boolean {
    return this.persistenceService.isAutoNavigation;
  }

  public set isAutoNavigation(isAutoNavigation: boolean) {
    this.persistenceService.isAutoNavigation =
      !this.persistenceService.isAutoNavigation;
  }

  public toggleAutoNavigation() {
    this.persistenceService.isAutoNavigation =
      !this.persistenceService.isAutoNavigation;
  }

  public get isPlayerReverse(): boolean {
    return this.persistenceService.isPlayerReverse;
  }

  public set isPlayerReverse(isPlayerReverse: boolean) {
    this.persistenceService.isPlayerReverse = isPlayerReverse;
  }

  public togglePlayerReverse() {
    this.persistenceService.isPlayerReverse =
      !this.persistenceService.isPlayerReverse;
  }

  public closeSettingPanel() {
    this.bottomSheet.dismiss();
  }
}
