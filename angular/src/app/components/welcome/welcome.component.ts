import { Component } from '@angular/core';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  constructor(private readonly persistenceService: PersistenceService) {}

  public close() {
    this.persistenceService.navigate('bet');
  }
}
