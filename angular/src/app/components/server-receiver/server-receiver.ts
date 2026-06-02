import { Component, inject, Input } from '@angular/core';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { PlayerOnCourtService } from '../../services/player-on-court.service';

@Component({
  selector: 'server-receiver',
  imports: [],
  templateUrl: './server-receiver.html',
  styleUrl: './server-receiver.scss',
})
export class ServerReceiver {
  @Input()
  point!: IPoint;

  private readonly playerNameService: PlayerOnCourtService =
    inject(PlayerOnCourtService);

  public getServer(): string {
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

  public getReceiver(): string {
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
