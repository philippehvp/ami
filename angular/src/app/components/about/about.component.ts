import { Component } from '@angular/core';
import { ILogo } from 'src/app/app.component';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  public socials: ILogo[] = [
    {
      icon: 'logo-isb',
      label: 'Internet',
      isLightAndDark: false,
      class: 'icon-large',
      link: 'https://www.istressportsbadminton.com',
    },
    {
      icon: 'logo-facebook',
      label: 'Facebook',
      isLightAndDark: false,
      class: 'icon-large',
      link: 'https://www.facebook.com/IstresSportsBadminton',
    },
    {
      icon: 'logo-instagram',
      label: 'Instagram',
      isLightAndDark: false,
      class: 'icon-large',
      link: 'https://www.instagram.com/istressportsbadminton/',
    },
  ];

  constructor(private readonly persistenceService: PersistenceService) {}

  public getLogoFile(logo: ILogo): string {
    const prefix = 'assets/img/logos/';
    if (this.persistenceService.theme.isLight || !logo.isLightAndDark) {
      return prefix + logo.icon + '.png';
    } else {
      return prefix + logo.icon + '_dark.png';
    }
  }

  public openLogoLink(logoOrLink: ILogo) {
    window.open((logoOrLink as ILogo).link, '_blank');
  }

  public openLink(link: string) {
    window.open(link, '_blank');
  }
}
