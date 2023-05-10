export interface IBetter {
  accessKey: string;
  firstName: string;
  name: string;
  isAdmin: boolean;
  isTutorialDone: boolean;
  isEvaluationDone: boolean;
}

export interface IBetterRaw {
  accessKey: string;
  firstName: string;
  name: string;
  isAdmin: number;
  isTutorialDone: number;
  isEvaluationDone: number;
}
