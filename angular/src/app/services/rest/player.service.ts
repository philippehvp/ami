import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from '../common.service';
import { IPlayer } from 'src/app/models/player';
import { map, of } from 'rxjs';
import { IEmpty, IOffline } from 'src/app/models/utils';

export interface IStoredPlayer {
  categoryId: number;
  players: IPlayer[];
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private httpClient = inject(HttpClient);

  private _allPlayers: IStoredPlayer[] = [];

  public emptyPlayers() {
    this._allPlayers = [];
  }

  public getPlayers(
    accessKey: string,
    categoryId: number
  ): Observable<IOffline | IPlayer[]> {
    // Recherche des joueurs qui auraient déjà été lus
    const storedPlayer = this._allPlayers.find(
      (storedPlayer: IStoredPlayer) => {
        return storedPlayer.categoryId === categoryId;
      }
    );

    if (storedPlayer) {
      return of(storedPlayer.players);
    } else {
      const url = CommonService.getURL('player/players');
      return this.httpClient
        .post<IPlayer[]>(url, {
          accessKey,
          category: categoryId,
        })
        .pipe(
          map((players) => {
            this._allPlayers.push({ categoryId: categoryId, players: players });
            return players;
          })
        );
    }
  }

  public setPlayerName(accessKey: string): Observable<IOffline | IEmpty> {
    const url = CommonService.getURL('player/setPlayersName');

    return this.httpClient
      .post<IOffline | IEmpty>(url, {
        accessKey,
      })
      .pipe();
  }
}
