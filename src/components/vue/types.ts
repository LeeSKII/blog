export type ChartCompletion = {
  id: string;
  messages: Message[];
};
export type Message = {
  role: string;
  model: string;
  content: string;
};
