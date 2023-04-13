import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IBetter, IBetterRaw } from 'src/app/models/better';
import { CommonService } from './common.service';
import { IContest } from 'src/app/models/contest';
import { map } from 'rxjs/internal/operators/map';
import { ICategory } from 'src/app/models/category';
import { IPlayer } from 'src/app/models/player';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private httpClient: HttpClient) {}

  public getPlayers(
    accessKey: string,
    categoryId: number
  ): Observable<IPlayer[]> {
    const url = CommonService.getURL('player/players');
    return this.httpClient.post<IPlayer[]>(url, {
      accessKey,
      category: categoryId,
    });
  }
}
