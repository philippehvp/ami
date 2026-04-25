import { Component, inject, Input } from '@angular/core';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { PlayerOnCourtService } from '../../services/player-on-court.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'court',
  imports: [MatIconModule],
  templateUrl: './court.html',
  styleUrl: './court.scss',
})
export class Court {
  @Input()
  justPlayedPoint!: IPoint;

  private readonly playerNameService: PlayerOnCourtService =
    inject(PlayerOnCourtService);

  public getPlayerName(index: number): string {
    return this.playerNameService.getPlayerName(index);
  }

  public getArrow(justPlayedPoint: IPoint): string {
    if (justPlayedPoint.serverSide === SERVER_SIDE.LEFT) {
      if (justPlayedPoint.pointLeftPair % 2 === 0) {
        return 'north_east';
      } else {
        return 'south_east';
      }
    } else {
      if (justPlayedPoint.pointRightPair % 2 === 0) {
        return 'south_west';
      } else {
        return 'north_west';
      }
    }
  }
}
