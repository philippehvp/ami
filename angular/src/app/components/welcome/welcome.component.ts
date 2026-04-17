import { Component } from '@angular/core';
import { PersistenceService } from '../../services/persistence.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [MatButtonModule],
})
export class WelcomeComponent {
  constructor(private readonly persistenceService: PersistenceService) {}

  public close() {
    this.persistenceService.navigate('bet');
  }
}
