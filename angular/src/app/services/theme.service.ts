import { Injectable } from '@angular/core';

export interface IAnimatedElement {
  id: number;
  colorClass: string;
  sizeClass: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  /**
   * Retourne un nombre aléatoire d'éléments avec des identifants qui seront ensuite mélangés
   */
  public get animatedElements(): IAnimatedElement[] {
    // Nombre aléatoire d'éléments
    const count: number = Math.floor(Math.random() * (20 - 17 + 1) + 17);

    // Création d'éléments avec comme une valeur croissante
    const elements: IAnimatedElement[] = [];
    for (let i: number = 0; i < count; i++) {
      const randomColor: number = Math.floor(Math.random() * (4 - 1 + 1) + 1);
      const randomSize: number = Math.floor(Math.random() * (4 - 1 + 1) + 1);

      elements.push({
        id: i,
        colorClass: `color${randomColor}`,
        sizeClass: `size${randomSize}`,
      });
    }

    // Mélange des éléments
    for (let i: number = elements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = elements[i];
      elements[i] = elements[j];
      elements[j] = temp;
    }

    return elements;
  }
}
