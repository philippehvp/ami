import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { IBetterPoint } from 'src/app/models/better-point';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetterPointActions } from 'src/app/store/action/better-point.action';
import { BetState } from 'src/app/store/state/bet.state';
import { BetterPointState } from 'src/app/store/state/better-point.state';

@Component({
  selector: 'bet-point',
  templateUrl: './bet-point.component.html',
  styleUrls: ['./bet-point.component.scss'],
})
export class BetPointComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private persistenceService = inject(PersistenceService);

  @Select(BetterPointState.betterPoints)
  betterPoints$!: Observable<IBetterPoint[]>;

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  private destroy$!: Subject<boolean>;

  public displayedColumns: string[] = ['better', 'points'];

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.better$
      .pipe(
        takeUntil(this.destroy$),
        map((better) => {
          this.store
            .dispatch([new BetActions.CalculatePointsAndRanking()])
            .subscribe(() => {
              this.store.dispatch([
                new BetterPointActions.GetBetterPoint(
                  better.accessKey,
                  this.persistenceService.categoryId
                ),
              ]);
            });
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }
}
