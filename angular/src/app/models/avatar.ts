export interface IUniverse {
  id: number;
  name: string;
  folder: string;
}

export interface IAvatar {
  id: number;
  universeyId: number;
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
