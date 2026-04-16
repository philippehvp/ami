import { DOCUMENT } from '@angular/common';
import { Injectable, Renderer2, inject } from '@angular/core';
import { ITheme } from '../models/theme';

export interface IBubble {
  id: number;
  colorClass: string;
  sizeClass: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);

  /**
   * Retourne un nombre aléatoire de bulles avec des identifants qui seront ensuite mélangés
   */
  public get blues(): IBubble[] {
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

  // private _circleColors: string[][] = [
  //   ['#605e76', '#97a5d3', '#bba7e3', '#d594de', '#e585d4', '#df94bf'],
  //   ['#7f667e', '#e0b3de', '#dcc3f4', '#d9c0f3', '#a0bcef', '#b4b9df'],
  //   ['#7e7671', '#e3d5cc', '#f8dedd', '#f5ced7', '#f1c2d1', '#e6c5ca'],
  //   ['#354a4b', '#547b7e', '#6587a2', '#6f88c2', '#7c8dd9', '#939fcc'],
  //   ['#785d7c', '#daa8e3', '#c3abc0', '#869778', '#608d4e', '#98ae88'],
  //   ['#fcc916', '#f28e16', '#c5e6f7', '#6caee0', '#b0d6b1', '#8abb8c'],
  //   ['#71637b', '#ceb1e1', '#dbcdf8', '#cfdaf8', '#c3e4f5', '#b8e2e6'],
  //   ['#71757d', '#cad3e3', '#ede2cb', '#f7da8c', '#f7d360', '#edd184'],
  //   ['#294d5c', '#37808f', '#7c98ac', '#bea5c2', '#eaaed3', '#d1acd0'],
  //   ['#2c624e', '#41b089', '#6fa0b5', '#8371d8', '#8f50f2', '#b38eed'],
  //   ['#7c6e2d', '#dbc145', '#d0cd72', '#9cc39d', '#6cbcb8', '#9abca7'],
  //   ['#715036', '#cc8e5c', '#e6a574', '#ecb188', '#efbf9e', '#e4cfb8'],
  // ];

  //private circleThemeInterval: any = 0;

  public setTheme(renderer: Renderer2, theme: ITheme) {
    renderer.setAttribute(this.document.body, 'class', theme.mode);
    // if (theme.id === 2) {
    //   this.changeCircleColors();
    //   this.enterCircleTheme();
    // } else {
    //   this.exitCircleTheme();
    // }
  }

  // private enterCircleTheme() {
  //   this.circleThemeInterval = setInterval(() => {
  //     this.changeCircleColors();
  //   }, 20000);
  // }

  // private changeCircleColors() {
  //   // Nombre aléatoire
  //   const index: number = Math.floor(Math.random() * this._circleColors.length);

  //   // Changement des couleurs de transition
  //   document.documentElement.style.setProperty(
  //     '--color0',
  //     `${this._circleColors[index][0]}`,
  //   );
  //   document.documentElement.style.setProperty(
  //     '--color1',
  //     `${this._circleColors[index][1]}`,
  //   );
  //   document.documentElement.style.setProperty(
  //     '--color2',
  //     `${this._circleColors[index][2]}`,
  //   );
  //   document.documentElement.style.setProperty(
  //     '--color3',
  //     `${this._circleColors[index][3]}`,
  //   );
  //   document.documentElement.style.setProperty(
  //     '--color4',
  //     `${this._circleColors[index][4]}`,
  //   );
  //   document.documentElement.style.setProperty(
  //     '--color5',
  //     `${this._circleColors[index][5]}`,
  //   );
  // }

  // private exitCircleTheme() {
  //   if (this.circleThemeInterval) {
  //     clearInterval(this.circleThemeInterval);
  //   }
  // }
}
