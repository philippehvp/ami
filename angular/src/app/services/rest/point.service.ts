import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from './common.service';
import { IBetterPoint } from 'src/app/models/point';
import { IOffline } from 'src/app/models/utils';

@Injectable({
  providedIn: 'root',
})
export class PointService {
  constructor(private httpClient: HttpClient) {}

  public getBetterPoints(
    categoryId: number
  ): Observable<IBetterPoint[] | IOffline> {
    const url = CommonService.getURL('point/betterPoints');
    const params: HttpParams = new HttpParams().set('category', categoryId);
    return this.httpClient.get<IBetterPoint[]>(url, { params });
  }
}
