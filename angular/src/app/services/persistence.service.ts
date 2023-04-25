import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PersistenceServiceService {
  private _withClubName: boolean = false;

  public get withClubName(): boolean {
    return this._withClubName;
  }

  public set withClubName(withClubName: boolean) {
    this._withClubName = withClubName;
  }
}
