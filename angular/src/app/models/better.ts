export interface ISetting {
  withClubName: boolean;
  isAutoNavigation: boolean;
  isPlayerReverse: boolean;
  isDarkMode: boolean;
}

export interface ISettingRaw {
  clubName: number;
  autoNavigation: number;
  playerReverse: number;
  darkMode: number;
}

export interface IBetter {
  accessKey: string;
  randomKey: string;
  firstName: string;
  name: string;
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
  isAdmin: number;
  isTutorialDone: number;
  evaluation: number;
  endBetDate: string;
  setting: ISettingRaw;
}
