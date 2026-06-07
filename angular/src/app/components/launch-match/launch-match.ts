import { Component, inject, model } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { MatRadioButton, MatRadioModule } from '@angular/material/radio';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { IFirstPoint, ILaunchMatchData } from '../../models/launch-data';
import { IPlayerPosition } from '../../models/player-position';
import { SERVER_SIDE } from '../../models/point';
import { MatchService } from '../../services/match.service';
import {
  COURT_MODE,
  PlayerOnCourtService,
} from '../../services/player-on-court.service';
@Component({
  selector: 'launch-match-left-right',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatRadioModule,
    MatRadioModule,
    MatRadioButton,
  ],
  templateUrl: './launch-match.html',
  styleUrl: './launch-match.scss',
})
export class LaunchMatch {
  private readonly playerOnCourtService: PlayerOnCourtService =
    inject(PlayerOnCourtService);

  public server = model<number>();
  public receiver = model<number>();
  public serverSide = model<number>();
  public leftRightMode = model<number>();

  public launchMatchData: ILaunchMatchData = inject(MAT_DIALOG_DATA);
  private matDialogRef = inject(MatDialogRef<ILaunchMatchData>);

  public validate() {
    const firstPoint: IFirstPoint = {
      pointLeftPair: 0,
      pointRightPair: 0,
      serverSide: this.serverSide(),
      playerPositionLeftPair: this.getPlayerPositionLeftPair(),
      playerPositionRightPair: this.getPlayerPositionRightPair(),
    } as IFirstPoint;

    if (this.leftRightMode() === 1) {
      this.playerOnCourtService.setCourtMode(COURT_MODE.LEFT_RIGHT);
    } else {
      this.playerOnCourtService.setCourtMode(COURT_MODE.UP_DOWN);
    }

    this.matDialogRef.close(firstPoint);
  }

  private getPlayerPositionLeftPair(): IPlayerPosition {
    let serverSide = 0;
    serverSide = this.serverSide()?.valueOf() || 0;

    if (serverSide === SERVER_SIDE.LEFT) {
      let server = 0;
      server = this.server()?.valueOf() || 0;

      if (server === 1 || server === 2) {
        return {
          playerLeft: server === 1 ? 2 : 1,
          playerRight: server === 1 ? 1 : 2,
        };
      } else if (server === 3 || server === 4) {
        return {
          playerLeft: server === 3 ? 4 : 3,
          playerRight: server === 3 ? 3 : 4,
        };
      }
    } else if (serverSide === SERVER_SIDE.RIGHT) {
      let receiver = 0;
      receiver = this.receiver()?.valueOf() || 0;

      if (receiver === 1 || receiver === 2) {
        return {
          playerLeft: receiver === 1 ? 2 : 1,
          playerRight: receiver === 1 ? 1 : 2,
        };
      } else if (receiver === 3 || receiver === 4) {
        return {
          playerLeft: receiver === 3 ? 4 : 3,
          playerRight: receiver === 3 ? 3 : 4,
        };
      }
    }

    return {} as IPlayerPosition;
  }

  private getPlayerPositionRightPair(): IPlayerPosition {
    let serverSide = -1;
    serverSide = this.serverSide()?.valueOf() || -1;

    if (serverSide === SERVER_SIDE.RIGHT) {
      let server = 0;
      server = this.server()?.valueOf() || 0;
      if (server === 1 || server === 2) {
        return {
          playerLeft: server === 1 ? 2 : 1,
          playerRight: server === 1 ? 1 : 2,
        };
      } else if (server === 3 || server === 4) {
        return {
          playerLeft: server === 3 ? 4 : 3,
          playerRight: server === 3 ? 3 : 4,
        };
      }
    } else if (serverSide === SERVER_SIDE.LEFT) {
      let receiver = 0;
      receiver = this.receiver()?.valueOf() || 0;
      if (receiver === 1 || receiver === 2) {
        return {
          playerLeft: receiver === 1 ? 2 : 1,
          playerRight: receiver === 1 ? 1 : 2,
        };
      } else if (receiver === 3 || receiver === 4) {
        return {
          playerLeft: receiver === 3 ? 4 : 3,
          playerRight: receiver === 3 ? 3 : 4,
        };
      }
    }

    return {} as IPlayerPosition;
  }

  public get isLaunchable(): boolean | undefined {
    return MatchService.isMatchLaunchable(
      this.server(),
      this.receiver(),
      this.serverSide(),
    );
  }
}
