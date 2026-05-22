import { Injectable } from '@angular/core';
import { IPoint, SERVER_SIDE } from '../models/point';

@Injectable({
  providedIn: 'root',
})
export class ArrowService {
  public static getArrowLeftRight(point: IPoint): string {
    if (point.serverSide === SERVER_SIDE.LEFT) {
      return point.pointLeftPair % 2 === 0
        ? 'material-symbols-outlined north-east'
        : 'material-symbols-outlined south-east';
    } else {
      return point.pointRightPair % 2 === 0
        ? 'material-symbols-outlined south-west'
        : 'material-symbols-outlined north-west';
    }
  }

  public static getArrowUpDown(point: IPoint): string {
    if (point.serverSide === SERVER_SIDE.LEFT) {
      return point.pointLeftPair % 2 === 0
        ? 'material-symbols-outlined south-east'
        : 'material-symbols-outlined south-west';
    } else {
      return point.pointRightPair % 2 === 0
        ? 'material-symbols-outlined north-west'
        : 'material-symbols-outlined north-east';
    }
  }
}
