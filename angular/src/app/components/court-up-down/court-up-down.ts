import { Component, inject, Input } from '@angular/core';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { PlayerOnCourtService } from '../../services/player-on-court.service';
import { MatIconModule } from '@angular/material/icon';
import { ArrowService } from '../../services/arrow.service';

@Component({
  selector: 'court-up-down',
  imports: [MatIconModule],
  templateUrl: './court-up-down.html',
  styleUrl: './court-up-down.scss',
})
export class CourtUpDown {
  @Input()
  point!: IPoint;

  private readonly playerNameService: PlayerOnCourtService =
    inject(PlayerOnCourtService);

  public getPlayerName(point: IPoint, areaPosition: number): string {
    if (this.isServer(point, areaPosition)) {
      return this.getServer();
    } else if (this.isReceiver(point, areaPosition)) {
      return this.getReceiver();
    }

    return '';
  }

  public getClassUpDown(
    baseClassName: string,
    point: IPoint,
    areaPosition: number,
  ): string {
    if (this.isServer(point, areaPosition)) {
      return `${baseClassName} server`;
    } else if (this.isReceiver(point, areaPosition)) {
      return `${baseClassName} receiver`;
    }
    return `${baseClassName} player`;
  }

  private getServer(): string {
    if (this.point.serverSide === SERVER_SIDE.LEFT) {
      if (this.isServer(this.point, 1)) {
        return this.playerNameService.getPlayerName(
          this.point.playerPositionLeftPair.playerLeft,
        );
      } else {
        return this.playerNameService.getPlayerName(
          this.point.playerPositionLeftPair.playerRight,
        );
      }
    } else {
      if (this.isServer(this.point, 3)) {
        return this.playerNameService.getPlayerName(
          this.point.playerPositionRightPair.playerRight,
        );
      } else {
        return this.playerNameService.getPlayerName(
          this.point.playerPositionRightPair.playerLeft,
        );
      }
    }
  }

  private getReceiver(): string {
    if (this.point.serverSide === SERVER_SIDE.LEFT) {
      if (this.isReceiver(this.point, 3)) {
        return this.playerNameService.getPlayerName(
          this.point.playerPositionRightPair.playerRight,
        );
      } else {
        return this.playerNameService.getPlayerName(
          this.point.playerPositionRightPair.playerLeft,
        );
      }
    } else {
      if (this.isReceiver(this.point, 1)) {
        return this.playerNameService.getPlayerName(
          this.point.playerPositionLeftPair.playerLeft,
        );
      } else {
        return this.playerNameService.getPlayerName(
          this.point.playerPositionLeftPair.playerRight,
        );
      }
    }
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

  private isReceiver(point: IPoint, areaPosition: number): boolean {
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
