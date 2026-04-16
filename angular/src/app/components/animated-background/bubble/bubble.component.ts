import { Component, OnInit, inject } from '@angular/core';
import { PersistenceService } from '../../../services/persistence.service';
import {
  IBubble as IBubble,
  ThemeService,
} from '../../../services/theme.service';

@Component({
  selector: 'bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
})
export class BubbleComponent implements OnInit {
  private themeService = inject(ThemeService);
  private persistenceService = inject(PersistenceService);

  public bubbles!: IBubble[];

  public ngOnInit() {
    this.bubbles = this.themeService.blues;
  }

  public get animationPlayState(): string {
    return this.persistenceService.isThemeAnimated ? 'running' : 'paused';
  }

  public getBubbleClass(bubble: IBubble): string {
    return bubble.colorClass + ' ' + bubble.sizeClass;
  }
}
