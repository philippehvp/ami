import { Component, OnInit, inject } from '@angular/core';
import { PersistenceService } from '../../../services/persistence.service';

@Component({
  selector: 'circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
})
export class CircleComponent implements OnInit {
  private persistenceService = inject(PersistenceService);

  private _circleTop!: string;
  private _circleLeft!: string;
  private _circleAnimation!: string;

  public get animationPlayState(): string {
    return this.persistenceService.isThemeAnimated ? 'running' : 'paused';
  }

  public ngOnInit() {
    this._circleTop = Math.floor(Math.random() * 150).toString() + 'px';
    this._circleLeft = Math.floor(Math.random() * 150).toString() + 'px';
    this._circleAnimation =
      'ripple 20s linear infinite, colors 30s linear infinite';
  }

  public get circleTop(): string {
    return this._circleTop;
  }

  public get circleLeft(): string {
    return this._circleLeft;
  }

  public get circleAnimation(): string {
    return this._circleAnimation;
  }
}
