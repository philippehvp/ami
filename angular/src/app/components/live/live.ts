import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngxs/store';
import { UmpireActions } from '../../store/action/umpire.action';
import { Observable } from 'rxjs';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { UmpireState } from '../../store/state/umpire.state';
import { AsyncPipe } from '@angular/common';
import { PlayerNameService } from '../../services/player-name.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'live',
  imports: [AsyncPipe, MatButtonModule, MatIconModule],
  templateUrl: './live.html',
  styleUrl: './live.scss',
})
export class Live {
  private readonly store: Store = inject(Store);
  private readonly playerNameService: PlayerNameService =
    inject(PlayerNameService);

  public justPlayedPoint$: Observable<IPoint | undefined>;

  constructor() {
    this.justPlayedPoint$ = this.store.select(UmpireState.justPlayedPoint);
  }

  public getPlayerName(index: number): string {
    return this.playerNameService.getPlayerName(index);
  }

  public addPointTeamLeft() {
    this.store.dispatch(new UmpireActions.AddPoint(true));
  }

  public addPointTeamRight() {
    this.store.dispatch(new UmpireActions.AddPoint(false));
  }

  public getArrow(justPlayedPoint: IPoint): string {
    if (justPlayedPoint.serverSide === SERVER_SIDE.LEFT) {
      if (justPlayedPoint.pointTeamLeft % 2 === 0) {
        return 'north_east';
      } else {
        return 'south_east';
      }
    } else {
      if (justPlayedPoint.pointTeamRight % 2 === 0) {
        return 'south_west';
      } else {
        return 'north_west';
      }
    }
    return '';
  }
}
