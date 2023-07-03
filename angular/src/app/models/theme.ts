export interface ITheme {
  id: number;
  name: string;
  mode: string;
  isLight: boolean;
  isAnimated: boolean;
  color?: string;
  border?: string;
  tag?: string;
  classes?: string[];
}
