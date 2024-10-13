interface MessageProps {
  message: any;
  sent?: boolean;
}

const ReceivedMessage = ({ message, sent }: MessageProps) => {
  return (
    <div
      className={`ml-3 w-fit max-w-[70vw] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-2xl ${
        sent
          ? "rounded-tr-sm bg-[#0084FF] text-white"
          : "rounded-tl-sm text-black"
      } flex justify-center h-fit items-center max-w-full`}
    >
      <div className="p-5 md:text-lg text-base font-bold w-full break-words">
        {message}
      </div>
    </div>
  );
};

export default ReceivedMessage;
