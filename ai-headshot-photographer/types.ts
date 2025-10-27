
export enum AppState {
  INITIAL,
  IMAGE_UPLOADED,
  GENERATING,
  RESULT_READY,
  EDITING,
}

export interface HeadshotStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
}
