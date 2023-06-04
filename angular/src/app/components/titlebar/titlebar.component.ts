import { Component, Input, inject } from '@angular/core';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss'],
})
export class TitlebarComponent {
  private persistenceService = inject(PersistenceService);

  @Input()
  title!: string;

  public back() {
    this.persistenceService.navigate(this.persistenceService.gobackPage);
  }
}
