import { IBetterAvatar } from './avatar';

export interface ISetting {
  isClubName: boolean;
  isAutoNavigation: boolean;
  isPlayerReverse: boolean;
  theme: number;
}

export interface ISettingRaw {
  clubName: number;
  autoNavigation: number;
  playerReverse: number;
  theme: number;
  playerRanking: number;
  firstnameVisible: number;
}

export interface IBetter {
  accessKey: string;
  randomKey: string;
  firstName: string;
  name: string;
  club: string;
  betterAvatar: IBetterAvatar;
  isAdmin: boolean;
  isTutorialDone: boolean;
  evaluation: number;
  endBetDate: Date | null;
}

export interface IBetterRaw {
  accessKey: string;
  randomKey: string;
  firstName: string;
  name: string;
  club: string;
  avatar_id: number;
  avatar_file: string;
  avatar_name: string;
  universe_id: number;
  universe_folder: string;
  universe_name: string;
  isAdmin: number;
  isTutorialDone: number;
  evaluation: number;
  endBetDate: string;
  setting: ISettingRaw;
}
