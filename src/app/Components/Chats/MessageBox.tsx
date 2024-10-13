import { Input } from "@nextui-org/react";
import { IoSendSharp } from "react-icons/io5";

interface Props {
  messageValue: string;
  setMessageValue: (text: string) => void;
  sendFunction: () => void;
}

const MessageBox = ({ messageValue, setMessageValue, sendFunction }: Props) => {
  return (
    <form className="absolute bottom-0 w-full">
      <Input
        className="bg-white"
        color="primary"
        value={messageValue}
        id="chat"
        onChange={(e) => setMessageValue(e.target.value)}
        fullWidth
        label="Your Message..."
        variant="bordered"
        placeholder="Enter your Message"
        endContent={
          <button
            className="focus:outline-none"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              sendFunction();
            }}
            aria-label="Send"
          >
            <IoSendSharp className="w-7 h-7 text-blue-500" />
          </button>
        }
        type="text"
      />
    </form>
  );
};

export default MessageBox;
