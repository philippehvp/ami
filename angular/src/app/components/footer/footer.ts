import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly themeService: ThemeService = inject(ThemeService);

  public switchThemeMode() {
    this.themeService.switchThemeMode();
  }
}
