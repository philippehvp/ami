import { Component, inject } from '@angular/core';
import { ILogo } from 'src/app/app.component';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  private persistenceService = inject(PersistenceService);

  // public logos: ILogo[][] = [
  //   [
  //     {
  //       icon: 'logo-phocea-light',
  //       label: 'Phocea Light',
  //       isLightAndDark: false,
  //       class: 'icon-large',
  //       link: 'https://www.phocealight.fr/',
  //     },
  //     {
  //       icon: 'logo-ffbad',
  //       label: 'FFBAD',
  //       isLightAndDark: false,
  //       class: 'icon-large',
  //       link: 'https://www.ffbad.org/',
  //     },
  //   ],
  //   [
  //     {
  //       icon: 'logo-balotti',
  //       label: 'Balotti',
  //       isLightAndDark: false,
  //       class: 'icon-small',
  //       link: 'https://balotti.eu/',
  //     },

  //     {
  //       icon: 'logo-liguesud',
  //       label: 'Ligue Sud',
  //       isLightAndDark: false,
  //       class: 'icon-large',
  //       link: 'http://www.liguepacabad.org/',
  //     },
  //   ],
  //   [
  //     {
  //       icon: 'logo-badventure',
  //       label: 'Badventure',
  //       isLightAndDark: false,
  //       class: 'icon-large',
  //       link: 'https://www.badventure.fr/',
  //     },

  //     {
  //       icon: 'logo-ville-istres',
  //       label: "Ville d'Istres",
  //       isLightAndDark: false,
  //       class: 'icon-large',
  //       link: 'https://www.istres.fr/',
  //     },
  //   ],
  // ];

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

  public getLogoFile(logo: ILogo): string {
    const prefix = 'assets/img/logos/';
    if (this.persistenceService.theme.isLight || !logo.isLightAndDark) {
      return prefix + logo.icon + '.png';
    } else {
      return prefix + logo.icon + '_dark.png';
    }
  }

  public openLink(logo: ILogo) {
    window.open(logo.link, '_blank');
  }
}
