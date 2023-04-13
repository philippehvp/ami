import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from './common.service';
import { IBetterPoint } from 'src/app/models/better-point';
import { IOffline } from 'src/app/models/utils';

@Injectable({
  providedIn: 'root',
})
export class BetterPointService {
  constructor(private httpClient: HttpClient) {}

  public getBettersPoints(
    accessKey: string,
    categoryId: number
  ): Observable<IBetterPoint[] | IOffline> {
    const url = CommonService.getURL('point/bettersPoints');
    return this.httpClient.post<IBetterPoint[]>(url, {
      accessKey,
      category: categoryId,
    });
  }
}
