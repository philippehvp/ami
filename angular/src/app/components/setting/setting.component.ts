import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  private matDialogRef = inject(MatDialogRef);
  private persistenceService = inject(PersistenceService);
  private store = inject(Store);

  @Select(BetState.isAutoNavigation)
  isAutoNavigation$!: Observable<boolean>;

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

  public toggleAutoNavigation() {
    this.store.dispatch([new BetActions.ToggleAutoNavigation()]);
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

  public close() {
    this.matDialogRef.close();
  }
}
