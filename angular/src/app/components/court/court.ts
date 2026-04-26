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
  point!: IPoint;

  private readonly playerNameService: PlayerOnCourtService =
    inject(PlayerOnCourtService);

  public getPlayerName(playerNumber: number): string {
    return this.playerNameService.getPlayerName(playerNumber);
  }

  public getArrow(point: IPoint): string {
    if (point.serverSide === SERVER_SIDE.LEFT) {
      return point.pointLeftPair % 2 === 0 ? 'north_east' : 'south_east';
    } else {
      return point.pointRightPair % 2 === 0 ? 'south_west' : 'north_west';
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

    if (ret) {
      console.log('Receveur', point, areaPosition);
    }

    return ret;
  }
}
