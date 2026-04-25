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
import { IFirstPoint, ILaunchSetData } from '../../models/launch-data';
import { IPlayerPosition } from '../../models/player-position';
import { SERVER_SIDE } from '../../models/point';
import { PlayerOnCourtService } from '../../services/player-on-court.service';
@Component({
  selector: 'launch-set',
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
  templateUrl: './launch-set.html',
  styleUrl: './launch-set.scss',
})
export class LaunchSet {
  private readonly playerOnCourtService: PlayerOnCourtService =
    inject(PlayerOnCourtService);

  public server = model<number>();
  public receiver = model<number>();

  public launchSetData: ILaunchSetData = inject(MAT_DIALOG_DATA);
  private matDialogRef = inject(MatDialogRef<ILaunchSetData>);

  constructor() {
    console.log(this.launchSetData);
  }

  public validate() {
    const firstPoint: IFirstPoint = {
      pointLeftPair: 0,
      pointRightPair: 0,
      serverSide: this.launchSetData.serverSide,
      playerPositionLeftPair: this.getPlayerPositionLeftPair(),
      playerPositionRightPair: this.getPlayerPositionRightPair(),
    } as IFirstPoint;
    this.matDialogRef.close(firstPoint);
  }

  public get player1Name(): string {
    return this.playerOnCourtService.getPlayerName(1);
  }

  public get player2Name(): string {
    return this.playerOnCourtService.getPlayerName(2);
  }

  public get player3Name(): string {
    return this.playerOnCourtService.getPlayerName(3);
  }

  public get player4Name(): string {
    return this.playerOnCourtService.getPlayerName(4);
  }

  private getPlayerPositionLeftPair(): IPlayerPosition {
    if (this.launchSetData.serverSide === SERVER_SIDE.LEFT) {
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
    } else if (this.launchSetData.serverSide === SERVER_SIDE.RIGHT) {
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
    if (this.launchSetData.serverSide === SERVER_SIDE.RIGHT) {
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
    } else if (this.launchSetData.serverSide === SERVER_SIDE.LEFT) {
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
}
