import { Component, inject } from '@angular/core';
import { PersistenceService } from 'src/app/services/persistence.service';

export interface ILogo {
  icon: string;
  label: string;
  isLightAndDark: boolean;
}

@Component({
  selector: 'sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss'],
})
export class SponsorComponent {
  private persistenceService = inject(PersistenceService);

  public logos: ILogo[][] = [
    [
      { icon: 'logo-isb', label: 'ISB', isLightAndDark: true },
      {
        icon: 'logo-phocea-light',
        label: 'Phocea Light',
        isLightAndDark: true,
      },
      { icon: 'logo-balotti', label: 'Balotti', isLightAndDark: false },
    ],
    [
      { icon: 'logo-liguesud', label: 'Ligue Sud', isLightAndDark: false },
      { icon: 'logo-ffbad', label: 'FFBAD', isLightAndDark: false },
      {
        icon: 'logo-ville-istres',
        label: "Ville d'Istres",
        isLightAndDark: false,
      },
    ],
  ];

  public getLogoFile(logo: ILogo): string {
    const prefix = 'assets/img/logos/';
    if (!this.persistenceService.isDarkMode || !logo.isLightAndDark) {
      return prefix + logo.icon + '.png';
    } else {
      return prefix + logo.icon + '_dark.png';
    }
  }
}
