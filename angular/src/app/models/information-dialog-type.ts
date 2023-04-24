export enum InformationDialogType {
  Information,
  YesNo,
}

export interface IInformationDialogConfig {
  title: string;
  message: string;
  dialogType: InformationDialogType;
  labels: string[];
}
