import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Injectable, Renderer2, inject } from '@angular/core';
import { IPlayer, IPlayerForReviewOf } from '../models/player';
import { PersistenceService } from './persistence.service';
import { ITheme } from '../models/theme';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private platform = inject(Platform);
  private document = inject(DOCUMENT);
  private persistenceService = inject(PersistenceService);

  private _isMobile: boolean | null = null;

  public get isMobile(): boolean {
    if (this._isMobile !== null) {
      return this._isMobile;
    } else {
      this._isMobile =
        this.platform.ANDROID || this.platform.IOS || window.innerWidth <= 768;
      return this._isMobile;
    }
  }

  public setTheme(renderer: Renderer2, theme: ITheme) {
    renderer.setAttribute(this.document.body, 'class', theme.mode);

    // Changement de l'image de fond, différente selon les thèmes
    // L'image de fond concerne un seul élément de la page
    if (theme.tag) {
      // Suppression de la classe appliquée au thème précédent si nécessaire
      if (this.persistenceService.currentTag) {
        const oldElt = document.getElementsByClassName(
          this.persistenceService.currentTag
        )[0];
        if (oldElt && this.persistenceService.currentClass) {
          renderer.removeClass(oldElt, this.persistenceService.currentClass);
        }
      }

      // Sauvegarde de ces nouvelles informations
      this.persistenceService.currentTag = theme.tag;
      const index = Math.floor(Math.random() * (theme.classes || []).length);
      const newClass =
        theme.classes && theme.classes.length > index
          ? theme.classes[index]
          : '';
      this.persistenceService.currentClass = newClass;

      // Mise en place de la nouvelle classe pour le nouveau thème
      if (newClass) {
        const newElt = document.getElementsByClassName(theme.tag)[0];
        renderer.addClass(newElt, newClass);
      }
    }
  }

  public firstPlayerLabel(player: IPlayer | IPlayerForReviewOf): string {
    if (player && player.playerName1) {
      let ret: string = this.persistenceService.isPlayerRanking
        ? player.playerRanking1 + ' - '
        : '';

      ret += this.persistenceService.isFirstnameVisible
        ? player.playerName1
        : player.playerNameOnly1;

      return ret;
    }

    return '-';
  }

  public secondPlayerLabel(player: IPlayer | IPlayerForReviewOf): string {
    if (player && player.playerName2) {
      let ret: string = this.persistenceService.isPlayerRanking
        ? player.playerRanking2 + ' - '
        : '';

      ret += this.persistenceService.isFirstnameVisible
        ? player.playerName2
        : player.playerNameOnly2;

      return ret;
    }

    return '-';
  }

  public firstPlayerClub(player: IPlayer | IPlayerForReviewOf): string {
    return player && player.playerClub1 ? player.playerClub1 : '';
  }

  public secondPlayerClub(player: IPlayer | IPlayerForReviewOf): string {
    return player && player.playerClub2 ? player.playerClub2 : '';
  }
}
