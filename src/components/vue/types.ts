export type ChatCompletion = {
  id: string;
  messages: Message[];
};
export type Message = {
  role: string;
  model: string;
  content: string;
};
