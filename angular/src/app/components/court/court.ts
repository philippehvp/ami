import { Component, inject, Input } from '@angular/core';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { PlayerNameService } from '../../services/player-name.service';
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

  private readonly playerNameService: PlayerNameService =
    inject(PlayerNameService);

  public getPlayerName(index: number): string {
    return this.playerNameService.getPlayerName(index);
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
  }
}
