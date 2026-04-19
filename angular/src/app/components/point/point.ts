import { Component, Input, OnInit } from '@angular/core';
import { IPoint } from '../../models/point';
import { ISet } from '../../models/set';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'point',
  imports: [],
  templateUrl: './point.html',
  styleUrl: './point.scss',
})
export class Point implements OnInit {
  @Input()
  set!: ISet;

  public points!: IPoint[];

  public ngOnInit() {
    // Création des cases pour affichage
    this.points = [];
    for (let i: number = 0; i < 59; i++) {
      this.points.push({} as IPoint);
    }

    // Mise en place des scores
    let index: number = 0;
    this.set.points.forEach((point) => {
      this.points[index].pointPlayer1 = point.pointPlayer1;
      this.points[index].pointPlayer2 = point.pointPlayer2;
      this.points[index].server = point.server;
      this.points[index].receiver = point.receiver;
    });
  }

  public isNotNullNorUndefined(obj: unknown): boolean {
    return UtilsService.isNotNullNorUndefined(obj);
  }
}
