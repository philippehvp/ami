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
import { IFirstPoint, ILaunchData } from '../../models/launch-data';
import { IPlayerPosition } from '../../models/player-position';
import { SERVER_SIDE } from '../../models/point';
@Component({
  selector: 'app-launch',
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
  templateUrl: './launch.html',
  styleUrl: './launch.scss',
})
export class Launch {
  public server = model<number>();
  public receiver = model<number>();
  public serverSide = model<number>();

  public launchData: ILaunchData = inject(MAT_DIALOG_DATA);
  private matDialogRef = inject(MatDialogRef<ILaunchData>);

  constructor() {}

  public validate() {
    const firstPoint: IFirstPoint = {
      pointTeamLeft: 0,
      pointTeamRight: 0,
      serverSide: this.serverSide(),
      playerPositionLeftTeam: this.getPlayerPositionLeftTeam(),
      playerPositionRightTeam: this.getPlayerPositionRightTeam(),
    } as IFirstPoint;
    this.matDialogRef.close(firstPoint);
  }

  private getPlayerPositionLeftTeam(): IPlayerPosition {
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

  private getPlayerPositionRightTeam(): IPlayerPosition {
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
}
