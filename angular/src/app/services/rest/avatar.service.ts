import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from '../common.service';
import { IUniverseAvatar, IUniverseAvatarRaw } from 'src/app/models/avatar';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private httpClient = inject(HttpClient);

  public getAvatars(): Observable<IUniverseAvatar> {
    const url = CommonService.getURL('avatar/avatars');
    return this.httpClient.get<IUniverseAvatarRaw>(url).pipe(
      map((universeAvatarRaw) => {
        const universeAvatar: IUniverseAvatar = {
          universes: universeAvatarRaw.universes,
          avatars: [],
        };

        universeAvatarRaw.avatars.map((avatarRaw) => {
          universeAvatar.avatars.push({
            id: avatarRaw.id,
            universeId: avatarRaw.universe_id,
            file: avatarRaw.file,
            name: avatarRaw.name,
          });
        });

        return universeAvatar;
      })
    );
  }
}
