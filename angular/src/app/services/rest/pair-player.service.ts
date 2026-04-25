import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from '../common.service';
import { IPair } from '../../models/pair';
import { map, of } from 'rxjs';

export interface IStoredPair {
  categoryId: number;
  pairs: IPair[];
}

@Injectable({
  providedIn: 'root',
})
export class PairPlayerService {
  private httpClient = inject(HttpClient);

  private _allPairs: IStoredPair[] = [];

  public emptyPairs() {
    this._allPairs = [];
  }

  public getPairs(categoryId: number): Observable<IPair[]> {
    // Recherche des joueurs qui auraient déjà été lus
    const storedPair = this._allPairs.find((storedPlayer: IStoredPair) => {
      return storedPlayer.categoryId === categoryId;
    });

    if (storedPair) {
      return of(storedPair.pairs);
    } else {
      const url = CommonService.getURL('player/players');
      return this.httpClient
        .post<IPair[]>(url, {
          category: categoryId,
        })
        .pipe(
          map((pairs) => {
            this._allPairs.push({ categoryId: categoryId, pairs: pairs });
            return pairs;
          }),
        );
    }
  }
}
