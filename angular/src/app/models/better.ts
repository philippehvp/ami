export interface ISetting {
  isClubName: boolean;
  isAutoNavigation: boolean;
  isPlayerReverse: boolean;
  isPlayerRanking: boolean;
  isFirstnameVisible: boolean;
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
  isAdmin: number;
  isTutorialDone: number;
  evaluation: number;
  endBetDate: string;
  setting: ISettingRaw;
}
