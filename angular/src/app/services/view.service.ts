import { Injectable, signal } from '@angular/core';

export enum VIEW {
  LIVE,
  FIRST_SET,
  SECOND_SET,
  THIRD_SET,
}

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  private static _view = signal(VIEW.LIVE);

  public static get view(): VIEW {
    return ViewService._view();
  }

  public static set view(view: VIEW) {
    ViewService._view.set(view);
  }
}
