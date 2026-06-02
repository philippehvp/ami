import { Component, Input } from '@angular/core';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'court',
  imports: [MatIconModule],
  templateUrl: './court.html',
  styleUrl: './court.scss',
})
export class Court {
  @Input()
  point!: IPoint;

  public getClassLeftRight(
    baseClassName: string,
    point: IPoint,
    areaPosition: number,
  ): string {
    return this.isServerLeftRight(point, areaPosition)
      ? `${baseClassName} server`
      : `${baseClassName} player`;
  }

  private isServerLeftRight(point: IPoint, areaPosition: number): boolean {
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

  public getClassUpDown(
    baseClassName: string,
    point: IPoint,
    areaPosition: number,
  ): string {
    return this.isServerUpDown(point, areaPosition)
      ? `${baseClassName} server`
      : `${baseClassName} player`;
  }

  private isServerUpDown(point: IPoint, areaPosition: number): boolean {
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
}
