export interface IUniverse {
  id: number;
  name: string;
  folder: string;
}

export interface IAvatar {
  id: number;
  universeId: number;
  file: string;
  name: string;
}

export interface IAvatarRaw {
  id: number;
  universe_id: number;
  file: string;
  name: string;
}

export interface IUniverseAvatar {
  universes: IUniverse[];
  avatars: IAvatar[];
}

export interface IUniverseAvatarRaw {
  universes: IUniverse[];
  avatars: IAvatarRaw[];
}

export interface IBetterAvatar {
  universe: IUniverse;
  avatar: IAvatar;
}
