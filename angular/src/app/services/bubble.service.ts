import { Injectable } from '@angular/core';

export interface IBubble {
  id: number;
  colorClass: string;
  sizeClass: string;
}

@Injectable({
  providedIn: 'root',
})
export class BubbleService {
  /**
   * Retourne un nombre aléatoire de bulles avec des identifants qui seront ensuite mélangés
   */
  public get bubbles(): IBubble[] {
    // Nombre aléatoire de bulles
    const count: number = Math.floor(Math.random() * (20 - 17 + 1) + 17);

    // Création de bulles avec comme une valeur croissante
    const bubbles: IBubble[] = [];
    for (let i: number = 0; i < count; i++) {
      const randomColor: number = Math.floor(Math.random() * (4 - 1 + 1) + 1);
      const randomSize: number = Math.floor(Math.random() * (4 - 1 + 1) + 1);

      bubbles.push({
        id: i,
        colorClass: `color${randomColor}`,
        sizeClass: `size${randomSize}`,
      });
    }

    // Mélange des bulles
    for (let i: number = bubbles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = bubbles[i];
      bubbles[i] = bubbles[j];
      bubbles[j] = temp;
    }

    return bubbles;
  }
}
