import { Component, inject } from '@angular/core';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  private persistenceService = inject(PersistenceService);

  public close() {
    this.persistenceService.navigate('bet');
  }
}
