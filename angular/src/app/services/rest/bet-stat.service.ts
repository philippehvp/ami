import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IOffline } from '../../models/utils';
import { CommonService } from '../common.service';
import { IBetStat } from '../../models/bet-stat';

@Injectable({
  providedIn: 'root',
})
export class BetStatService {
  private httpClient = inject(HttpClient);

  public getBetStat(accessKey: string): Observable<IBetStat[] | IOffline> {
    const url = CommonService.getURL('stat/betStat');
    return this.httpClient.post<IBetStat[]>(url, {
      accessKey,
    });
  }
}
