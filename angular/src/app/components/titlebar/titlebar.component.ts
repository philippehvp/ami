import { Component, Input } from '@angular/core';
import { PersistenceService } from '../../services/persistence.service';

@Component({
  selector: 'titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss'],
})
export class TitlebarComponent {
  @Input()
  title!: string;

  constructor(private readonly persistenceService: PersistenceService) {}

  public back() {
    this.persistenceService.navigate(this.persistenceService.gobackPage);
  }
}
