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
  firstName: string;
  name: string;
  isAdmin: boolean;
  isTutorialDone: boolean;
  evaluation: number;
  setting: ISetting;
}

export interface IBetterRaw {
  accessKey: string;
  firstName: string;
  name: string;
  isAdmin: number;
  isTutorialDone: number;
  evaluation: number;
  setting: ISettingRaw;
}
