import { Component, inject, Input } from '@angular/core';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { PlayerOnCourtService } from '../../services/player-on-court.service';
import { MatIconModule } from '@angular/material/icon';
import { ArrowService } from '../../services/arrow.service';

@Component({
  selector: 'court-left-right',
  imports: [MatIconModule],
  templateUrl: './court-left-right.html',
  styleUrl: './court-left-right.scss',
})
export class CourtLeftRight {
  @Input()
  point!: IPoint;

  private readonly playerNameService: PlayerOnCourtService =
    inject(PlayerOnCourtService);

  public getPlayerName(playerNumber: number): string {
    return this.playerNameService.getPlayerName(playerNumber);
  }

  public getClass(
    baseClassName: string,
    point: IPoint,
    areaPosition: number,
  ): string {
    return this.isServer(point, areaPosition)
      ? `${baseClassName} server`
      : `${baseClassName} player`;
  }

  public getArrow(point: IPoint): string {
    return ArrowService.getArrowLeftRight(point);
  }

  private isServer(point: IPoint, areaPosition: number): boolean {
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
}
