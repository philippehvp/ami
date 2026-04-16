import { Component, inject } from '@angular/core';
import { PersistenceService } from '../../../services/persistence.service';

@Component({
  selector: 'sky',
  templateUrl: './sky.component.html',
  styleUrls: ['./sky.component.scss'],
})
export class SkyComponent {
  private persistenceService = inject(PersistenceService);

  public get animationPlayState(): string {
    return this.persistenceService.isThemeAnimated ? 'running' : 'paused';
  }
}
