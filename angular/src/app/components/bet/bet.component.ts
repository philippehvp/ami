import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/operators';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { BetState } from 'src/app/store/state/bet.state';
import { OfflineComponent } from '../offline/offline.component';

@Component({
  selector: 'bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent implements OnInit, OnDestroy {
  @Select(BetState.category)
  category$!: Observable<ICategory>;

  @Select(BetState.contest)
  contest$!: Observable<IContest>;

  @Select(BetState.isOffline)
  isOffline$!: Observable<boolean>;

  private isOfflineSub!: Subscription;

  constructor(private dialog: Dialog) {}

  public ngOnInit() {
    this.isOfflineSub = this.isOffline$
      ?.pipe(filter((isOffline) => !!isOffline))
      .subscribe((isOffline) => {
        if (isOffline) {
          console.log('isOffline détectée');
          const config: MatDialogConfig = {
            hasBackdrop: true,
            backdropClass: 'blur',
          };

          this.dialog.open(OfflineComponent, config);
        }
      });
  }

  public ngOnDestroy() {
    if (this.isOfflineSub) {
      this.isOfflineSub.unsubscribe();
    }
  }
}
