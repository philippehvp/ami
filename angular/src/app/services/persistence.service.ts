import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private _withClubName: boolean = false;
  private _accessKey!: string;
  private _categoryId!: number;

  public get withClubName(): boolean {
    return this._withClubName;
  }

  public set withClubName(withClubName: boolean) {
    this._withClubName = withClubName;
  }

  public get accessKey(): string {
    return this._accessKey;
  }

  public set accessKey(accessKey: string) {
    this._accessKey = accessKey;
  }

  public get categoryId(): number {
    return this._categoryId;
  }

  public set categoryId(categoryId: number) {
    this._categoryId = categoryId;
  }
}
