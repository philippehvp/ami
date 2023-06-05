import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IOffline } from '../../models/utils';
import { CommonService } from './common.service';
import { IBetterRanking } from '../../models/better-ranking';

@Injectable({
  providedIn: 'root',
})
export class BetterRankingService {
  private httpClient = inject(HttpClient);

  public getBettersRanking(
    accessKey: string,
    byRanking: boolean
  ): Observable<IBetterRanking[] | IOffline> {
    const url = CommonService.getURL('ranking/bettersRanking');
    return this.httpClient.post<IBetterRanking[]>(url, {
      accessKey,
      byRanking: byRanking ? 1 : 0,
    });
  }
}
