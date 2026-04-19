import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Point } from '../point/point';
import { IMatch } from '../../models/match';

@Component({
  selector: 'history',
  imports: [MatTabsModule, Point],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History {
  public match: IMatch = {
    sets: [
      {
        id: 1,
        points: [
          {
            pointPlayer1: 10,
            pointPlayer2: 3,
            server: 10,
            receiver: 11,
          },
        ],
      },
      {
        id: 2,
        points: [
          {
            pointPlayer1: 4,
            pointPlayer2: 2,
            server: 14,
            receiver: 20,
          },
        ],
      },
      {
        id: 3,
        points: [],
      },
    ],
  };
}
