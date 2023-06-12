import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { IAvatar, IUniverse, IUniverseAvatar } from 'src/app/models/avatar';
import { PersistenceService } from 'src/app/services/persistence.service';
import { AvatarService } from 'src/app/services/rest/avatar.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit, OnDestroy {
  private matDialogRef = inject(MatDialogRef<AvatarComponent>);
  private avatarService = inject(AvatarService);
  private persistenceService = inject(PersistenceService);

  public universeAvatar: IUniverseAvatar = {
    universes: [],
    avatars: [],
  };

  public filteredAvatars: IAvatar[] = [];
  public selectedAvatar: IAvatar | undefined;

  public get universe(): IUniverse | undefined {
    return this.persistenceService.universe;
  }

  public ngOnInit() {
    this.avatarService
      .getAvatars()
      .pipe(
        map((universeAvatar) => {
          if (universeAvatar) {
            this.universeAvatar = {
              universes: universeAvatar.universes,
              avatars: universeAvatar.avatars,
            };

            this.selectedAvatar = this.persistenceService.avatar;

            if (this.persistenceService.universe) {
              this.restoreAvatars(this.persistenceService.universe.id);
            }
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {}

  public cancel() {
    this.matDialogRef.close(-1);
  }

  public validate() {
    if (this.selectedAvatar) {
      this.persistenceService.avatar = this.selectedAvatar;
      this.matDialogRef.close(this.selectedAvatar.id);
    }
  }

  public changeUniverse($event: any) {
    this.filteredAvatars = this.universeAvatar.avatars.filter((avatar) => {
      return avatar.universeyId === $event.value;
    });
    this.persistenceService.universe = this.universeAvatar.universes.find(
      (universe) => {
        return universe.id === $event.value;
      }
    );
  }

  public restoreAvatars(universeId: number) {
    this.filteredAvatars = this.universeAvatar.avatars.filter((avatar) => {
      return avatar.universeyId === universeId;
    });
  }

  public getAvatarSource(avatar: IAvatar): string {
    if (this.persistenceService.universe) {
      return CommonService.getAvatarSource(
        this.persistenceService.universe,
        avatar
      );
    }
    return '';
  }

  public setAvatar(avatar: IAvatar) {
    this.selectedAvatar = avatar;
  }
}
