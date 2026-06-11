import { Component, inject, Input, OnInit } from '@angular/core';
import { IPoint } from '../../models/point';
import { ISet } from '../../models/set';
import { UtilsService } from '../../services/utils.service';
import { Observable } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';
import { UmpireActions } from '../../store/action/umpire.action';

import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { Confirmation } from '../confirmation/confirmation';
import { VIEW, ViewService } from '../../services/view.service';
import { CourtLeftRight } from '../court-left-right/court-left-right';

@Component({
  selector: 'points',
  imports: [AsyncPipe, MatButtonModule, MatBottomSheetModule, CourtLeftRight],
  templateUrl: './points.html',
  styleUrl: './points.scss',
})
export class Points implements OnInit {
  @Input()
  set$!: Observable<ISet>;

  private readonly store: Store = inject(Store);

  public pointToShow: IPoint | undefined = undefined;
  public pointIndex: number | undefined = undefined;

  public cells!: IPoint[];

  private goBackToConfirmation = inject(MatBottomSheet);

  constructor() {}

  public ngOnInit() {
    // Création des cases pour affichage
    this.cells = [];
    for (let i: number = 0; i < 60; i++) {
      this.cells.push({} as IPoint);
    }
  }

  public isSet(obj: unknown): boolean {
    return UtilsService.isNotNullNorUndefined(obj);
  }

  public showPoint(set: ISet, pointIndex: number) {
    // On considère que l'on veut revenir à ce point si on clique à nouveau dessus
    if (this.pointIndex === pointIndex) {
      this.goBackToConfirmation
        .open(Confirmation)
        .afterDismissed()
        .subscribe((isGoBackConfirmation: boolean) => {
          if (isGoBackConfirmation) {
            this.goBackToPoint(set);
            ViewService.view = VIEW.LIVE;
          }
        });
    } else {
      if (set.points && pointIndex < set.points.length) {
        this.pointToShow = set.points[pointIndex];
        this.pointIndex = pointIndex;
      }
    }
  }

  public displayScore(point: IPoint): string {
    return `${point.pointLeftPair} - ${point.pointRightPair}`;
  }

  public cellHasPoint(points: IPoint[], index: number): boolean {
    return index < points.length;
  }

  public getClass(points: IPoint[], index: number): string {
    // Cas particulier du point actif : dans ce cas, on ne considère pas que le point a été joué
    // pour que les propriétés du point actif priment sur celles du point joué
    if (index === this.pointIndex) {
      return 'is-active';
    } else if (index < points.length) {
      return 'played';
    }
    return 'empty';
  }

  public isActive(index: number) {
    return index === this.pointIndex;
  }

  public goBackToPoint(set: ISet) {
    this.store.dispatch(
      new UmpireActions.GoBackToPoint(set.setId, this.pointIndex),
    );
  }
}
