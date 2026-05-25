import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Store } from '@ngxs/store';
import { UmpireActions } from '../../store/action/umpire.action';

@Component({
  selector: 'footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly store: Store = inject(Store);
  private readonly themeService: ThemeService = inject(ThemeService);

  public switchThemeMode() {
    this.themeService.switchThemeMode();
  }
}
