export interface TFeedback {
  id: string;
  url: string;
}
export interface TGetFeedback {
  getFeedback: TFeedback;
}
export interface TFeedbackInitialValues {
  url: string;
}
