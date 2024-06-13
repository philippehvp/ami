export interface ITheme {
  id: number;
  name: string;
  mode: string;
  isLight: boolean;
  isAnimated: boolean;
  color?: string;
  border?: string;
  classes?: string[];
  logoColor: string;
}
