import { Component, inject, Input } from '@angular/core';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { PlayerOnCourtService } from '../../services/player-on-court.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'court-up-down',
  imports: [MatIconModule],
  templateUrl: './court-up-down.html',
  styleUrl: './court-up-down.scss',
})
export class CourtUpDown {
  @Input()
  point!: IPoint;
  @Input()
  isLiveMode!: boolean;

  private readonly playerNameService: PlayerOnCourtService =
    inject(PlayerOnCourtService);

  public getPlayerName(playerNumber: number): string {
    return this.playerNameService.getPlayerName(playerNumber);
  }

  public getArrow(point: IPoint): string {
    if (point.serverSide === SERVER_SIDE.LEFT) {
      return point.pointLeftPair % 2 === 0 ? 'south_east' : 'south_west';
    } else {
      return point.pointRightPair % 2 === 0 ? 'north_west' : 'north_east';
    }
  }

  public isServer(point: IPoint, areaPosition: number): boolean {
    let ret = false;

    switch (areaPosition) {
      case 1:
        ret =
          point.serverSide === SERVER_SIDE.LEFT &&
          point.pointLeftPair % 2 !== 0;
        break;
      case 2:
        ret =
          point.serverSide === SERVER_SIDE.LEFT &&
          point.pointLeftPair % 2 === 0;
        break;
      case 3:
        ret =
          point.serverSide === SERVER_SIDE.RIGHT &&
          point.pointRightPair % 2 === 0;
        break;
      case 4:
        ret =
          point.serverSide === SERVER_SIDE.RIGHT &&
          point.pointRightPair % 2 !== 0;
        break;
    }

    return ret;
  }

  public isReceiver(point: IPoint, areaPosition: number): boolean {
    let ret = false;

    switch (areaPosition) {
      case 1:
        ret =
          point.serverSide === SERVER_SIDE.RIGHT &&
          point.pointRightPair % 2 !== 0;
        break;
      case 2:
        ret =
          point.serverSide === SERVER_SIDE.RIGHT &&
          point.pointRightPair % 2 === 0;
        break;
      case 3:
        ret =
          point.serverSide === SERVER_SIDE.LEFT &&
          point.pointLeftPair % 2 === 0;
        break;
      case 4:
        ret =
          point.serverSide === SERVER_SIDE.LEFT &&
          point.pointLeftPair % 2 !== 0;
        break;
    }

    return ret;
  }
}
