// export interface Chat {
//     adminName: string;
//     messages: string;
//     message: string;
//   }
type Message = {
  sender: string;
  text: string;
};
export interface ChatSectionProps {
  adminName: string;
  messages: Message[];
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  goBack: () => void;
}
