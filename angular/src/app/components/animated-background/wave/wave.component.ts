import { Component, inject } from '@angular/core';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'wave',
  templateUrl: './wave.component.html',
  styleUrls: ['./wave.component.scss'],
})
export class WaveComponent {
  private persistenceService = inject(PersistenceService);

  public get animationPlayState(): string {
    return this.persistenceService.isThemeAnimated ? 'running' : 'paused';
  }
}
